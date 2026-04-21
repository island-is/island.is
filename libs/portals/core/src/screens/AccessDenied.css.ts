import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const container = style({})

globalStyle(`${container}:has(ul) div`, {
  textAlign: 'left',
})
globalStyle(`${container} a`, {
  color: theme.color.blue400,
  textDecoration: 'underline',
})
