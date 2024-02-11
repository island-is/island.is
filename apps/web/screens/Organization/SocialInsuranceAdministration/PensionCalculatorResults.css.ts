import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const line = style({
  borderRight: `2px solid ${theme.color.blue200}`,
  height: '148px',
})

export const fullWidth = style({
  width: '100%',
})

export const textMaxWidth = style({
  maxWidth: '793px',
})

globalStyle('table tr th:first-child, table tr td:first-child', {
  width: '50%',
})

globalStyle('table tr th:not(:first-child), table tr td:not(:first-child)', {
  width: '25%',
})
