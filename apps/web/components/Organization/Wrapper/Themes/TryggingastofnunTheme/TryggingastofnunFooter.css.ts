import { style } from '@vanilla-extract/css'

export const container = style({
  paddingTop: '60px',
  paddingBottom: '60px',
  background: 'linear-gradient(178.72deg, #C6E8AC 6.76%, #F2F7EE 101.16%)',
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

export const locationBox = style({
  minHeight: '100px',
})
