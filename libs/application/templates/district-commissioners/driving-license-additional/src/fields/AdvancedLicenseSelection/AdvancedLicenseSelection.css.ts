import { globalStyle, style } from '@vanilla-extract/css'

export const root = style({})

// The shared Checkbox renders `children` inside a bordered/background box.
// Within this field we want the nested checkbox to sit flush inside the
// parent checkbox box, so neutralize that inner box styling.
globalStyle(`${root} [data-checkbox-children-container]`, {
  border: 'none',
  background: 'transparent',
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 35,
})
