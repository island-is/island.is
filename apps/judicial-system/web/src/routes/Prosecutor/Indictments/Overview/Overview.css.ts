import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const gridRowEqual = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridGap: theme.spacing[1],

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridTemplateColumns: '1fr 1fr',
    },

    [`screen and (min-width: ${theme.breakpoints.xl}px)`]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },
})
