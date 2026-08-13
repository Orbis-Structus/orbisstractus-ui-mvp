import { createTheme } from '@mui/material/styles';
import { legacyTokens, theme } from '../../theme/theme';

export const clientPortalTheme = createTheme(theme, {
  shape: { borderRadius: 16 },
  typography: {
    h4: {
      color: legacyTokens.navy,
      fontSize: '2rem',
      lineHeight: 1.15,
      fontWeight: 900,
      letterSpacing: '-0.03em',
    },
    h5: {
      color: legacyTokens.navy,
      fontSize: '1.65rem',
      lineHeight: 1.2,
      fontWeight: 900,
      letterSpacing: '-0.025em',
    },
    h6: { color: legacyTokens.navy, fontSize: '1.18rem', lineHeight: 1.3, fontWeight: 900 },
    body1: { lineHeight: 1.65 },
    body2: { lineHeight: 1.55 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${legacyTokens.line}`,
          borderRadius: 22,
          backgroundImage: 'none',
          boxShadow: '0 12px 36px rgba(11,31,58,.07)',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: { root: { padding: 28, '&:last-child': { paddingBottom: 28 } } },
    },
    MuiButton: {
      styleOverrides: {
        root: { minHeight: 38, borderRadius: 999, paddingInline: 18, fontWeight: 850 },
        outlined: {
          borderColor: '#d8e2ee',
          backgroundColor: '#fff',
          color: legacyTokens.blue,
          '&:hover': { borderColor: '#b9cee4', backgroundColor: legacyTokens.blueSoft },
        },
        containedPrimary: {
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 8px 18px rgba(31,95,171,.18)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 800 },
        filled: { backgroundColor: legacyTokens.blueSoft, color: legacyTokens.blue },
      },
    },
    MuiTable: { styleOverrides: { root: { borderCollapse: 'separate', borderSpacing: 0 } } },
    MuiTableHead: { styleOverrides: { root: { backgroundColor: '#f7f9fc' } } },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottomColor: '#e7edf4', paddingBlock: 13 },
        head: { color: legacyTokens.muted, fontSize: 12, fontWeight: 900, letterSpacing: '.02em' },
      },
    },
    MuiTextField: { defaultProps: { variant: 'outlined' } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 13,
          backgroundColor: '#fff',
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9eb9d4' },
        },
      },
    },
    MuiAlert: { styleOverrides: { root: { borderRadius: 13, alignItems: 'center' } } },
    MuiDialog: { styleOverrides: { paper: { backgroundImage: 'none' } } },
  },
});
