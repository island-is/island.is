import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const resultBorder = style({
  border: `1px dashed ${theme.color.blue300}`,
})
