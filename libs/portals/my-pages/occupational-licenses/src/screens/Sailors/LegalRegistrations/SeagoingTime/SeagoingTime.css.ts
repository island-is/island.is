import { globalStyle, style } from '@vanilla-extract/css'

export const searchButton = style({
  minWidth: '162px',
  width: 'fit-content',
})

export const datePicker = style({})

globalStyle(`${datePicker} > div > div`, {
  minWidth: 'unset',
})
