import { theme, themeUtils } from '@island.is/island-ui/theme'
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
  marginTop: 2,
  backgroundColor: theme.color.blue400,
  ...themeUtils.responsiveStyle({
    xs: {
      marginTop: 4,
    },
  }),
})

export const loading = style({
  minHeight: 200,
})

globalStyle(`${checkboxWrap} label > div`, {
  marginRight: 0,
})

globalStyle(`${btn} > span, ${btn} > h1`, {
  boxShadow: 'none',
  marginTop: 4,
  ...themeUtils.responsiveStyle({
    md: { marginTop: 3 },
  }),
})
