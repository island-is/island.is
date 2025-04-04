import { style } from '@vanilla-extract/css'

export const summaryWrap = style({
  paddingTop: '.75rem',
  paddingBottom: '.75rem',
})

export const summaryWrapNoEdit = style({
  marginBottom: '4rem',
})

export const summaryNoBorder = style({
  border: 'none',
  padding: '0',
})

export const gridRow = style({
  position: 'relative',
  display: 'flex',
  paddingTop: '12px',
  paddingBottom: '12px',
})

export const gridRowChangeButton = style({
  paddingRight: '144px',
})

export const divider = style({
  marginTop: '.75rem',
  marginBottom: '.75rem',
  borderBottom: '1px solid #F2F7FF',

  selectors: {
    '&:last-child': {
      borderColor: '#CCDFFF',
    },
  },
})

export const changeButton = style({
  position: 'absolute',
  top: '18px',
  right: '12px',
})

export const fileLinksList = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '.4rem',
  paddingTop: '.4rem',
})

export const fileLink = style({
  fontSize: '.8rem',
})
