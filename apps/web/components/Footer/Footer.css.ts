import { globalStyle, style } from '@vanilla-extract/css'

export const noWrap = style({
  display: 'flex',
  flexFlow: 'row nowrap',
})

export const fullWidth = style({
  width: '100%',
})

export const footer = style({
  maxWidth: '1342px',
  margin: '0 auto',
})

globalStyle(`${footer} a`, {
  wordBreak: 'break-all',
  textDecoration: 'underline',
  textUnderlineOffset: '5px',
})

globalStyle(`${footer} a:hover`, {
  textDecorationThickness: '2px',
})
