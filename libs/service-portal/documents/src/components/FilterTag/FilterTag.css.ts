import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const tag = style({
  marginRight: theme.spacing['1'],
})

export const icon = style({
  marginLeft: 3,
  position: 'relative',
  top: 3,
})
