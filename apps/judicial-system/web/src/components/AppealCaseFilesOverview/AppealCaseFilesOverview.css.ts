import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const childContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  textAlign: 'right',
  alignSelf: 'start',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      alignSelf: 'center',
    },
  },
})
