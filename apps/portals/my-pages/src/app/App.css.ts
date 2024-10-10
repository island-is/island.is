import { style, globalStyle } from '@vanilla-extract/css'

export const page = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
})

globalStyle(`${page} a:hover`, {
  textDecoration: 'none',
})
