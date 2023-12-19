import { globalStyle, style } from '@vanilla-extract/css'

export const svgWrap = style({
  position: 'relative',
})

globalStyle(`${svgWrap} svg`, {
  maxWidth: '100%',
  width: '100%',
  height: 'auto',
})
