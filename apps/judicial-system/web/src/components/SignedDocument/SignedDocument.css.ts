import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const container = style({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  margin: `0 ${theme.spacing[1]}px`,

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      flexDirection: 'row',
    },
  },
})

export const textContainer = style({
  textAlign: 'center',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      textAlign: 'right',
      margin: `0 ${theme.spacing[2]}px`,
    },
  },
})
