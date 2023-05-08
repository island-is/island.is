import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const relativeBox = style({
  position: 'relative',
})

export const blowout = style({
  position: 'absolute',
  top: 0,
  right: 0,
  margin: theme.spacing[2],
})
