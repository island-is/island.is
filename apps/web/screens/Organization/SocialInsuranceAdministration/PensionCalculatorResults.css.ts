import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const line = style({
  borderRight: `2px solid ${theme.color.blue200}`,
  height: '86px',
})

export const fullWidth = style({
  width: '100%',
})

export const textMaxWidth = style({
  maxWidth: '793px',
})

globalStyle('tbody', {
  borderBottom: '32px solid white',
})
