import { globalStyle, style } from '@vanilla-extract/css'

export const selectBox = style({})

globalStyle(
  `${selectBox} #react-select-month-listbox, ${selectBox} #react-select-year-listbox`,
  {
    position: 'relative',
  },
)
