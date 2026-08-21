import { globalStyle, style } from '@vanilla-extract/css'

/** When the preview wrapper has an explicit width, scale the SVG like `<img width="…" />`. */
export const svgContained = style({})

globalStyle(`${svgContained} svg`, {
  width: '100%',
  height: 'auto',
})
