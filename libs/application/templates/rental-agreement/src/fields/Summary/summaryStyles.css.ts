import { style } from '@vanilla-extract/css'

export const summaryWrap = style({
  paddingTop: '1.5rem',
  paddingBottom: '1rem',
})

export const summarySection = style({
  marginTop: '0.5rem',
  marginBottom: '1.5rem',
  padding: '1.5rem',
  border: '1px solid #ccDfff',
  borderRadius: '8px',
})

export const gridRow = style({
  display: 'flex',
})

export const divider = style({
  marginTop: '1rem',
  marginBottom: '1rem',
  borderBottom: '1px solid #F2F7FF',

  selectors: {
    '&:last-child': {
      display: 'none',
    },
  },
})
