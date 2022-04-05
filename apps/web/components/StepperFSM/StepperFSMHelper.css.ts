import { style } from '@vanilla-extract/css'

export const bold = style({
  fontWeight: 'bold',
})

export const border = style({
  border: '1px solid lightgrey',
  borderRadius: '.5rem',
  padding: '.2rem',
  paddingRight: '0',
})

export const fitBorder = style({
  border: '1px solid lightgrey',
  borderRadius: '.5rem',
  padding: '.2rem',
  width: 'fit-content',
})

export const error = style({
  cursor: 'pointer',
  ':hover': {
    opacity: 0.8,
  },
})
