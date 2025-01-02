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
  position: 'relative',
  display: 'flex',
  paddingRight: '100px',
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

export const alertMessageList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '.4rem',
})

export const alertMessageListItem = style({
  paddingTop: '.4rem',
})
