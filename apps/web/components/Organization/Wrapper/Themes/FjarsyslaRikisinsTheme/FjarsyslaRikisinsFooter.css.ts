import { style } from '@vanilla-extract/css'

export const container = style({
  paddingTop: '60px',
  paddingBottom: '60px',
})

export const emptyBox = style({
  width: '80px',
})

export const firstRow = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  gap: '20px',
})
