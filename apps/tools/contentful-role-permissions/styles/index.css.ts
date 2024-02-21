import { style } from '@vanilla-extract/css'

export const container = style({
  width: '80%',
  margin: '16px auto',
})

export const checkboxContainer = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  justifyContent: 'space-between',
})
