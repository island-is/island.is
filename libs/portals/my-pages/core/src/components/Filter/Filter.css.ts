import { globalStyle, style } from '@vanilla-extract/css'

export const dialogDisclosure = style({
  width: '100%',
})

export const dialogContainer = style({
  zIndex: 10000,
  overflowY: 'scroll',
})

export const popoverContainer = style({
  zIndex: 100,
  maxWidth: 360,
  width: '100%',
  overflowY: 'auto',
})

export const lgBtn = style({})

globalStyle(`${lgBtn} > span`, {
  height: '100%',
})
