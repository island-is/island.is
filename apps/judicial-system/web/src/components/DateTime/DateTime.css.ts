import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const dateTimeContainer = style({
  display: 'grid',
  rowGap: theme.spacing[2],

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridTemplateColumns: '2fr minmax(180px, 1fr)',
      columnGap: theme.spacing[2],
      rowGap: 0,
    },
  },
})
