import { style } from '@vanilla-extract/css'

// Strip the user-agent fieldset chrome (border/padding/margin) and the implicit
// min-width so the fieldset can be dropped into existing flex/grid layouts
// without changing the visual result.
export const fieldset = style({
  border: 0,
  margin: 0,
  padding: 0,
  minWidth: 0,
})

// Keeps the legend available to assistive technology while hiding it visually,
// for groups that already render an adjacent visible title.
export const visuallyHiddenLegend = style({
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
})
