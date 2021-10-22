import { style } from '@vanilla-extract/css'

export const cancelButtonContainer = style({
  order: 2,
  flexGrow: 1,
  textAlign: 'center',
  paddingTop: '24px',
  ':focus': {
    outline: 'none',
  },
})

export const cancelButton = style({
  ':focus': {
    outline: 'none',
  },
})
