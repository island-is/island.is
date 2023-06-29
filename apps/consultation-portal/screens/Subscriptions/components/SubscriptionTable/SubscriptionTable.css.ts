import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const checkmarkIcon = style({
  verticalAlign: 'bottom',
})

export const tableRowLeft = style({
  borderTopLeftRadius: theme.spacing[1],
  borderBottomLeftRadius: theme.spacing[1],
})

export const tableRowRight = style({
  borderTopRightRadius: theme.spacing[1],
  borderBottomRightRadius: theme.spacing[1],
})

export const paddingRightZero = style({
  paddingRight: 'unset',
})
