import { style } from '@vanilla-extract/css'

// Pushes title a bit above:
// The reason for that is that since we provide no title in form builder
// and instead we render dynamic title
export const sectionTitle = style({
  marginTop: -40
})
