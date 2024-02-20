import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const uppercase = style({
  textTransform: 'uppercase',
})

export const removeFieldButton = style({
  top: theme.spacing['8'],
  right: -theme.spacing['6'],
})

export const printButton = style({
  '@media': {
    [`screen and (min-width: 932px)`]: {
      top: 106,
      left: 140,
      zIndex: 10,
    },
  },
})
