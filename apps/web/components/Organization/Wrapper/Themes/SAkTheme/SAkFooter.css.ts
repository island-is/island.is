import { style } from '@vanilla-extract/css'

export const container = style({
  paddingTop: '60px',
  paddingBottom: '60px',
  backgroundColor: '#00498E',
})

export const emptyBox = style({
  width: '140px',
})

export const firstRow = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  gap: '20px',
})
