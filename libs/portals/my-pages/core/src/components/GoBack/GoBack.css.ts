import { globalStyle, style } from '@vanilla-extract/css'

export const noUnderline = style({})

globalStyle(`${noUnderline} span`, {
  boxShadow: 'none',
})
