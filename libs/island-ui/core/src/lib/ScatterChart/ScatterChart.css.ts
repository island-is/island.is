import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

// Marker on the ResponsiveContainer so the focus rules below stay scoped to this chart.
export const chartFocus = style({})

// recharts' accessibility layer makes the svg and its portal <g>s focusable, and a click outlines them.
globalStyle(`${chartFocus} :focus`, {
  outline: 'none',
})

// Keeps the keyboard ring; must stay below the reset, both selectors share specificity.
globalStyle(`${chartFocus} :focus-visible`, {
  outline: `3px solid ${theme.color.blue400}`,
  outlineOffset: 2,
})
