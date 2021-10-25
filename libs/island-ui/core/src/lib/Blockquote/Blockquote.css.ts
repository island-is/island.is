import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const blockquote = style({
  boxShadow: `inset 2px 0 0 ${theme.color.purple400}`,
})
