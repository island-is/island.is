import { style } from '@vanilla-extract/css'

export const container = style({
  background:
    'linear-gradient(178.67deg, rgba(0, 61, 133, 0.2) 1.87%, rgba(0, 61, 133, 0.3) 99.6%)',
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
