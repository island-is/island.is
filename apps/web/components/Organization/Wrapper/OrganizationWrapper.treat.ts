import { style } from 'treat'
import { themeUtils } from '@island.is/island-ui/core'

export const headerBg = style({
  backgroundRepeat: 'no-repeat !important',
  backgroundPosition: 'right !important',
  backgroundBlendMode: 'overlay',
  marginTop: -130,
  paddingTop: 130,
  ...themeUtils.responsiveStyle({
    md: {
      marginBottom: '2px',
    },
  }),
})

export const headerBorder = style({
  ...themeUtils.responsiveStyle({
    md: {
      borderBottom: '4px solid #ffbe43',
    },
  }),
})

export const headerWrapper = style({
  marginTop: -20,
})

export const headerLogo = style({
  width: 50,
  marginRight: 18,
  ...themeUtils.responsiveStyle({
    md: {
      width: 111,
      marginRight: 40,
    },
  }),
})

export const navigation = style({
  ...themeUtils.responsiveStyle({
    md: {
      background: 'none',
      paddingTop: 0,
    },
    xs: {
      marginLeft: -24,
      marginRight: -24,
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 32,
    },
  }),
})

export const navigationWithLogo = style({
  ...themeUtils.responsiveStyle({
    md: {
      marginTop: -220,
    },
    xs: {
      marginTop: 0,
    },
  }),
})

export const navigationWithoutLogo = style({
  ...themeUtils.responsiveStyle({
    md: {
      marginTop: -195,
    },
    xs: {
      marginTop: 0,
    },
  }),
})
