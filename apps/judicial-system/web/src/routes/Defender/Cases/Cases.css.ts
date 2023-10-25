import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const infoContainer = style({
  width: '50%',

  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)  `]: {
      width: '100%',
    },
  },
})
