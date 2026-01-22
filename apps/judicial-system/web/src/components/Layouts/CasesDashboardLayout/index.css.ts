import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const gridContainer = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  columnGap: '0',
  rowGap: theme.spacing[2],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridAutoRows: 'minmax(12rem, auto)',
      columnGap: theme.spacing[2],
      rowGap: theme.spacing[2],
    },
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridTemplateColumns: 'repeat(4, 1fr)',
      columnGap: theme.spacing[3],
      rowGap: theme.spacing[3],
    },
  },
})
