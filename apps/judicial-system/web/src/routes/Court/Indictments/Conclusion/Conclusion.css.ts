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
  },
})
