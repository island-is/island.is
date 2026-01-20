import { style } from '@vanilla-extract/css'

export const container = style({
  background:
    'linear-gradient(90deg, #1C1664 0%, #2A2E67 50.92%, #37436A 86.57%)',
  maxWidth: '1342px',
  margin: '0 auto',
})

export const mainColumn = style({
  paddingTop: '30px',
  paddingBottom: '24px',
})

export const line = style({
  borderTop: '1px solid white',
  borderBottom: '1px solid white',
  paddingBottom: '16px',
  marginTop: '16px',
  paddingTop: '48px',
})

export const locationBox = style({
  minHeight: '100px',
})
