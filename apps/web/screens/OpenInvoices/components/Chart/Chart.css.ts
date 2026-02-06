import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const xAxisText = style({
  fill: theme.color.black,
  fontSize: '14px',
  textAnchor: 'middle',
})

export const legendIcon = style({
  width: '24px',
  height: '24px',
  borderRadius: theme.border.radius.standard,
})
