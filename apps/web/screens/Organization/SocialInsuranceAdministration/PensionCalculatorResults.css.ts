import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const line = style({
  borderRight: `2px solid ${theme.color.blue200}`,
  height: '148px',
})
