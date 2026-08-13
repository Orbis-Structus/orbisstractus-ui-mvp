import DrawRoundedIcon from '@mui/icons-material/DrawRounded';
import FlightRoundedIcon from '@mui/icons-material/FlightRounded';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import ThermostatRoundedIcon from '@mui/icons-material/ThermostatRounded';
import { Box, Typography } from '@mui/material';

export type EvidenceKind = 'ROOF' | 'WIN' | 'THERM' | 'DRONE' | 'AUDIO' | 'VOICE' | 'MARKUP' | 'VIDEO';

interface EvidenceTileProps {
  kind: EvidenceKind;
  caption: string;
}

const KIND_STYLES: Record<EvidenceKind, { bg: string; fg: string }> = {
  ROOF: { bg: '#183c63', fg: '#fff' },
  WIN: { bg: '#183c63', fg: '#fff' },
  THERM: { bg: '#a94f1f', fg: '#fff' },
  DRONE: { bg: '#102c49', fg: '#fff' },
  AUDIO: { bg: '#2467aa', fg: '#fff' },
  VOICE: { bg: '#2467aa', fg: '#fff' },
  MARKUP: { bg: '#b88a3c', fg: '#fff' },
  VIDEO: { bg: '#6f2635', fg: '#fff' },
};

export default function EvidenceTile({ kind, caption }: EvidenceTileProps) {
  const style = KIND_STYLES[kind];
  const Icon =
    kind === 'THERM'
      ? ThermostatRoundedIcon
      : kind === 'DRONE'
        ? FlightRoundedIcon
        : kind === 'AUDIO' || kind === 'VOICE'
          ? MicRoundedIcon
          : kind === 'MARKUP'
            ? DrawRoundedIcon
            : kind === 'VIDEO'
              ? PlayArrowRoundedIcon
              : PhotoCameraRoundedIcon;

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: 106,
        borderRadius: 2,
        bgcolor: style.bg,
        color: style.fg,
        p: 1.2,
        pt: 3.5,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          bgcolor: 'rgba(255,255,255,.16)',
          borderRadius: 1,
          px: 0.75,
          py: 0.2,
          fontSize: 9,
          fontWeight: 900,
          letterSpacing: '.06em',
        }}
      >
        {kind}
      </Box>
      <Icon sx={{ fontSize: 21, mb: 0.5, opacity: 0.95 }} />
      <Typography variant="caption" sx={{ display: 'block', lineHeight: 1.28, fontWeight: 700 }}>
        {caption}
      </Typography>
    </Box>
  );
}
