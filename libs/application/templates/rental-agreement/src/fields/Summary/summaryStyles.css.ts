import { style } from '@vanilla-extract/css'

export const summaryWrap = style({
  paddingTop: '.75rem',
  paddingBottom: '.75rem',
})

export const summaryNoBorder = style({
  border: 'none',
  padding: '0',
})

export const gridRow = style({
  display: 'flex',
})

export const divider = style({
  marginTop: '.75rem',
  marginBottom: '.75rem',
  borderBottom: '1px solid #F2F7FF',

  selectors: {
    '&:last-child': {
      display: 'none',
    },
  },
})
