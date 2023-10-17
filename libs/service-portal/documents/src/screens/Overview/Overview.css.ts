import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const btn = style({})

export const checkboxWrap = style({
  width: 48,
  display: 'flex',
  justifyContent: 'center',
})

export const bullet = style({
  height: 4,
  width: 4,
  backgroundColor: theme.color.blue400,
})

export const loading = style({
  minHeight: 200,
})

globalStyle(`${checkboxWrap} label > div`, {
  marginRight: 0,
})

globalStyle(`${btn} > span, ${btn} > h1`, {
  boxShadow: 'none',
})
