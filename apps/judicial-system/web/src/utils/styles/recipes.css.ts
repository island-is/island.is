import { recipe } from '@vanilla-extract/recipes'

import { theme } from '@island.is/island-ui/theme'

export const grid = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
  },
  variants: {
    gap: {
      1: { gap: theme.spacing[1] },
      2: { gap: theme.spacing[2] },
      3: { gap: theme.spacing[3] },
      4: { gap: theme.spacing[4] },
      5: { gap: theme.spacing[5] },
      6: { gap: theme.spacing[6] },
      7: { gap: theme.spacing[7] },
      8: { gap: theme.spacing[8] },
      9: { gap: theme.spacing[9] },
      10: { gap: theme.spacing[10] },
      12: { gap: theme.spacing[12] },
      15: { gap: theme.spacing[15] },
      20: { gap: theme.spacing[20] },
    },
    marginBottom: {
      1: { marginBottom: theme.spacing[1] },
      2: { marginBottom: theme.spacing[2] },
      3: { marginBottom: theme.spacing[3] },
      4: { marginBottom: theme.spacing[4] },
      5: { marginBottom: theme.spacing[5] },
      6: { marginBottom: theme.spacing[6] },
      7: { marginBottom: theme.spacing[7] },
      8: { marginBottom: theme.spacing[8] },
      9: { marginBottom: theme.spacing[9] },
      10: { marginBottom: theme.spacing[10] },
      12: { marginBottom: theme.spacing[12] },
      15: { marginBottom: theme.spacing[15] },
      20: { marginBottom: theme.spacing[20] },
    },
    marginTop: {
      1: { marginTop: theme.spacing[1] },
      2: { marginTop: theme.spacing[2] },
      3: { marginTop: theme.spacing[3] },
      4: { marginTop: theme.spacing[4] },
      5: { marginTop: theme.spacing[5] },
      6: { marginTop: theme.spacing[6] },
      7: { marginTop: theme.spacing[7] },
      8: { marginTop: theme.spacing[8] },
      9: { marginTop: theme.spacing[9] },
      10: { marginTop: theme.spacing[10] },
      12: { marginTop: theme.spacing[12] },
      15: { marginTop: theme.spacing[15] },
      20: { marginTop: theme.spacing[20] },
    },
  },
  defaultVariants: {
    gap: theme.spacing[2],
    marginBottom: theme.spacing[0],
    marginTop: theme.spacing[0],
  },
})
