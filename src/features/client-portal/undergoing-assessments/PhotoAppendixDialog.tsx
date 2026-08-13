import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Box, Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import EvidenceTile, { type EvidenceKind } from '../../../shared/components/EvidenceTile';
import { legacyTokens } from '../../../theme/theme';

interface PhotoItem {
  kind: EvidenceKind;
  caption: string;
}

interface PhotoGroup {
  componentCode: string;
  items: PhotoItem[];
}

const PHOTO_GROUPS: PhotoGroup[] = [
  {
    componentCode: 'B3010.10.02',
    items: [
      { kind: 'ROOF', caption: 'Ponding water — north bay' },
      { kind: 'ROOF', caption: 'Roof seam separation — section C' },
      { kind: 'ROOF', caption: 'Membrane blistering — south slope' },
      { kind: 'ROOF', caption: 'Roof drain sump — debris loading' },
      { kind: 'ROOF', caption: 'Flashing corrosion at parapet' },
      { kind: 'THERM', caption: 'Thermal moisture anomaly — IR' },
      { kind: 'THERM', caption: 'Thermal bridging at slab edge — IR' },
      { kind: 'DRONE', caption: 'Drone aerial overview — north elevation' },
      { kind: 'MARKUP', caption: 'Markup — defect callouts' },
    ],
  },
  {
    componentCode: 'B2020.20.01',
    items: [
      { kind: 'WIN', caption: 'Failed perimeter sealant' },
      { kind: 'WIN', caption: 'Window joint separation' },
      { kind: 'WIN', caption: 'Water staining at sill' },
      { kind: 'WIN', caption: 'Condensation / thermal bridging' },
      { kind: 'WIN', caption: 'Corroded frame edge' },
      { kind: 'THERM', caption: 'Window heat loss — IR' },
      { kind: 'DRONE', caption: 'Drone aerial overview — east elevation' },
      { kind: 'MARKUP', caption: 'Markup — defect callouts — south facade' },
    ],
  },
];

interface PhotoAppendixDialogProps {
  open: boolean;
  onClose: () => void;
  groups?: PhotoGroup[];
}

export default function PhotoAppendixDialog({ open, onClose, groups = PHOTO_GROUPS }: PhotoAppendixDialogProps) {
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      aria-labelledby="photo-appendix-title"
      slotProps={{
        paper: {
          sx: {
            width: 'min(1120px, calc(100vw - 32px))',
            maxHeight: 'min(820px, calc(100vh - 48px))',
            borderRadius: 4,
            m: 2,
            boxShadow: '0 26px 80px rgba(7,22,43,.28)',
          },
        },
        backdrop: { sx: { bgcolor: 'rgba(10,25,45,.52)', backdropFilter: 'blur(1px)' } },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          px: { xs: 2.5, md: 4 },
          pt: { xs: 2.75, md: 3.5 },
          pb: 2.25,
          borderBottom: '1px solid #e8edf3',
        }}
      >
        <Typography
          id="photo-appendix-title"
          component="h2"
          sx={{
            color: legacyTokens.navy,
            fontSize: { xs: 25, md: 30 },
            fontWeight: 900,
            letterSpacing: '-.025em',
            pr: 5,
            mb: 0.65,
          }}
        >
          Photo Appendix Preview
        </Typography>
        <Typography color="text.secondary">{total} tagged media items, grouped by component code</Typography>
        <IconButton
          onClick={onClose}
          aria-label="Close photo appendix"
          sx={{ position: 'absolute', top: 17, right: 18, color: legacyTokens.navy }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: { xs: 2.5, md: 4 }, py: 3.25 }}>
        {groups.map((group, groupIndex) => (
          <Box key={group.componentCode} component="section" sx={{ mb: groupIndex === groups.length - 1 ? 0 : 4 }}>
            <Typography
              sx={{
                color: legacyTokens.navy,
                fontSize: 16,
                fontWeight: 900,
                letterSpacing: '.015em',
                mb: 1.6,
              }}
            >
              {group.componentCode}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' },
                gap: 1.25,
              }}
            >
              {group.items.map((item, index) => (
                <EvidenceTile key={`${group.componentCode}-${index}`} kind={item.kind} caption={item.caption} />
              ))}
            </Box>
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
}
