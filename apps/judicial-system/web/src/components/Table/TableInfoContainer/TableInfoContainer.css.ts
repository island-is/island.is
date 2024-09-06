import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const infoContainer = style({
  marginBottom: theme.spacing[3],

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      maxWidth: '50%',
    },
  },
})
