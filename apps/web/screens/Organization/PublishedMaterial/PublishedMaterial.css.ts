import { style } from '@vanilla-extract/css'

export const container = style({
  minHeight: '800px',
})

export const orderByContainer = style({
  display: 'flex',
  flexDirection: 'row',
  cursor: 'pointer',
})

export const orderByText = style({
  textDecoration: 'underline',
  fontSize: '14px',
  marginRight: '4px',
})
