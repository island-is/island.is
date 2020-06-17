import { style, globalStyle } from 'treat'

export const container = style({
  height: 111,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const pointer = style({
  cursor: 'pointer',
})

export const authenticated = style({
  display: 'flex',
  alignItems: 'center',
  margin: '0 -16px',
})

globalStyle(`${authenticated} > div`, {
  padding: '0 16px',
})

export const userName = style({
  fontSize: '16px',
})
