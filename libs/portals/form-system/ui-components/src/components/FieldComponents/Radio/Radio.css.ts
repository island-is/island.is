import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const control = style({
  width: theme.spacing[3],
  flexShrink: 0,
})

export const option = style({
  width: '100%',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      width: '50%',
    },
  },
})
