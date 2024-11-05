import { style } from '@vanilla-extract/css'

export const topRow = style({
  display: 'flex',
  justifyContent: 'flex-end',
})

export const container = style({
  padding: '16px',
})

export const formContainer = style({
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: '16px',
})
