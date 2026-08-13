import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useToast } from '../../../shared/store/toastStore';
import { legacyTokens } from '../../../theme/theme';
import { PROJECT_DELIVERABLES } from './projectPresentation';

type ChipTone = 'green' | 'amber' | 'blue';

const EXECUTION_SCOPE = [
  {
    finding: 'Roof membrane failure',
    action: 'Prepare repair scope and contractor package',
    priority: 'High',
    budget: '$42,000',
  },
  {
    finding: 'Window sealant degradation',
    action: 'Prepare resealing scope and schedule review',
    priority: 'Medium',
    budget: '$15,000',
  },
];

const PHASES: { phase: string; status: string; tone: ChipTone }[] = [
  { phase: 'Report Delivery', status: PROJECT_DELIVERABLES[0].status, tone: 'amber' },
  { phase: 'Execution Authorization', status: 'Not Started', tone: 'blue' },
  { phase: 'Procurement Method', status: 'Not Selected', tone: 'blue' },
  { phase: 'Contractor Award', status: 'Pending', tone: 'blue' },
  { phase: 'Remediation Oversight', status: 'Pending', tone: 'blue' },
];

const FUTURE_CAPABILITIES = [
  'Contractor portal',
  'Schedule tracking',
  'Cost change tracking',
  'Progress photo reporting',
];

const METRICS = [
  { value: '2', label: 'Actions derived from report findings' },
  { value: '$57K', label: 'Placeholder budget' },
  { value: 'RFP', label: 'Procurement option' },
  { value: 'PM', label: 'Orbisstractus oversight role' },
];

const chipSx = (tone: ChipTone) => ({
  bgcolor:
    tone === 'green'
      ? legacyTokens.greenSoft
      : tone === 'amber'
        ? legacyTokens.amberSoft
        : legacyTokens.blueSoft,
  color: tone === 'green' ? legacyTokens.green : tone === 'amber' ? legacyTokens.amber : legacyTokens.blue,
  fontWeight: 900,
  border: 'none',
});

const cardSx = {
  borderRadius: 3,
  p: { xs: 2.25, md: 3 },
  boxShadow: '0 10px 30px rgba(11,31,58,.06)',
};

const sectionTitleSx = {
  color: legacyTokens.navy,
  fontSize: { xs: 21, md: 24 },
  fontWeight: 900,
  letterSpacing: '-.02em',
  mb: 2,
};

const headCellSx = { bgcolor: '#f7f9fc', color: 'text.secondary', fontWeight: 900 };

interface ExecutionManagementDialogProps {
  open: boolean;
  onClose: () => void;
  buildingName?: string;
}

export default function ExecutionManagementDialog({ open, onClose }: ExecutionManagementDialogProps) {
  const toast = useToast();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            width: { xs: 'calc(100vw - 24px)', md: 'min(1180px, calc(100vw - 96px))' },
            height: 'calc(100vh - 48px)',
            maxHeight: 920,
            m: { xs: 1.5, md: 0 },
            borderRadius: 4,
            bgcolor: '#f5f7fb',
            overflowY: 'auto',
            boxShadow: '0 28px 90px rgba(7,22,43,.3)',
            scrollbarColor: '#b7c3d2 transparent',
          },
        },
      }}
    >
      <Box
        sx={{
          px: { xs: 2.25, md: 4 },
          py: { xs: 2.5, md: 3.5 },
          bgcolor: '#fff',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            component="h2"
            sx={{
              color: legacyTokens.navy,
              fontSize: { xs: 25, md: 31 },
              fontWeight: 900,
              letterSpacing: '-.03em',
              mb: 0.65,
            }}
          >
            Partner Network · Execution Management
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 820 }}>
            Convert approved report findings into a controlled execution program while Orbisstractus remains the
            Owner&apos;s Representative / Program Manager.
          </Typography>
        </Box>
        <Button onClick={onClose} variant="outlined" sx={{ flexShrink: 0 }}>
          Close
        </Button>
      </Box>

      <Stack spacing={2.5} sx={{ p: { xs: 1.5, md: 3 } }}>
        <Card sx={cardSx}>
          <Typography sx={sectionTitleSx}>From Assessment to Execution</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            The execution module starts with approved InsightX findings and carries them forward into authorization,
            procurement, contractor award, oversight, and closeout.
          </Typography>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mb: 2.5 }}>
            <Chip size="small" label="Optional Module" sx={chipSx('blue')} />
            <Chip size="small" label="Available after QA" sx={chipSx('amber')} />
          </Stack>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 1.25,
            }}
          >
            {METRICS.map((metric) => (
              <Box
                key={metric.label}
                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#f8fafc', p: 2 }}
              >
                <Typography sx={{ color: legacyTokens.navy, fontSize: 25, fontWeight: 900, lineHeight: 1 }}>
                  {metric.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.8, fontWeight: 700 }}>
                  {metric.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Card>

        <Card sx={cardSx}>
          <Typography sx={sectionTitleSx}>Client Execution Scope</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={headCellSx}>Report Finding</TableCell>
                <TableCell sx={headCellSx}>Execution Action</TableCell>
                <TableCell sx={headCellSx}>Priority</TableCell>
                <TableCell sx={headCellSx}>Budget</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {EXECUTION_SCOPE.map((item) => (
                <TableRow key={item.finding}>
                  <TableCell sx={{ fontWeight: 800 }}>{item.finding}</TableCell>
                  <TableCell>{item.action}</TableCell>
                  <TableCell>
                    <Chip size="small" label={item.priority} sx={chipSx(item.priority === 'High' ? 'amber' : 'blue')} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>{item.budget}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box
            sx={{
              mt: 2,
              px: 2,
              py: 1.5,
              borderRadius: 2.5,
              bgcolor: legacyTokens.greenSoft,
              color: legacyTokens.green,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <CheckCircleRoundedIcon sx={{ fontSize: 20 }} />
            <Typography sx={{ fontWeight: 750 }}>
              These actions are derived from the approved InsightX report findings, not manually recreated.
            </Typography>
          </Box>
        </Card>

        <Card sx={cardSx}>
          <Typography sx={sectionTitleSx}>Client-Facing Status</Typography>
          <Table size="small" sx={{ mb: 2.5 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={headCellSx}>Phase</TableCell>
                <TableCell sx={headCellSx}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {PHASES.map((item) => (
                <TableRow key={item.phase}>
                  <TableCell sx={{ fontWeight: 800 }}>{item.phase}</TableCell>
                  <TableCell>
                    <Chip size="small" label={item.status} sx={chipSx(item.tone)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
            <Button
              variant="contained"
              onClick={() =>
                toast('Execution authorization request recorded. Post-authorization workflow is pending confirmation.')
              }
            >
              Authorize Execution Module
            </Button>
            <Button
              variant="outlined"
              onClick={() => toast('Tender / RFP path selection will be available after execution authorization.')}
            >
              Select Tender / RFP Path
            </Button>
          </Stack>
        </Card>

        <Card sx={cardSx}>
          <Typography sx={sectionTitleSx}>Orbisstractus Role</Typography>
          <Stack spacing={1.2}>
            <Box sx={{ bgcolor: legacyTokens.greenSoft, color: legacyTokens.green, borderRadius: 2.5, px: 2, py: 1.5 }}>
              <Typography sx={{ fontWeight: 850 }}>
                Orbisstractus acts as Owner&apos;s Representative / Program Manager.
              </Typography>
            </Box>
            <Box sx={{ bgcolor: legacyTokens.amberSoft, color: legacyTokens.amber, borderRadius: 2.5, px: 2, py: 1.5 }}>
              <Typography sx={{ fontWeight: 850 }}>
                Orbisstractus coordinates scope, procurement, reporting, reviews, and closeout.
              </Typography>
            </Box>
            <Box sx={{ bgcolor: legacyTokens.redSoft, color: legacyTokens.red, borderRadius: 2.5, px: 2, py: 1.5 }}>
              <Typography sx={{ fontWeight: 850 }}>
                Orbisstractus does not perform the physical remediation work.
              </Typography>
            </Box>
          </Stack>
        </Card>

        <Card sx={cardSx}>
          <Typography sx={sectionTitleSx}>Enabled Later</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={headCellSx}>Capability</TableCell>
                <TableCell sx={headCellSx}>Availability</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {FUTURE_CAPABILITIES.map((capability) => (
                <TableRow key={capability}>
                  <TableCell sx={{ fontWeight: 800 }}>{capability}</TableCell>
                  <TableCell>
                    <Chip size="small" label="Activatable" sx={chipSx('blue')} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Stack>
    </Dialog>
  );
}
