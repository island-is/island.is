import { style } from '@vanilla-extract/css'

// As tall as a tag, which is taller than the title beside it, so a row does
// not grow when the "being changed" tag appears in it.
export const sessionTitle = style({
  minHeight: 32,
})
