import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const visuallyHidden = style({
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: 1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
})

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
