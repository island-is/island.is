import { style } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const headerBg = style({
  background: theme.color.blueberry600,
  marginTop: -130,
  paddingTop: 130,
  ...themeUtils.responsiveStyle({
    md: {
      marginBottom: '2px',
      maxHeight: 365,
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

  ...themeUtils.responsiveStyle({
    md: {
      marginTop: -20,
    },
  }),
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
      marginTop: -230,
      background: 'none',
      paddingBottom: 0,
    },
    xs: {
      marginTop: 0,
      marginLeft: -24,
      marginRight: -24,
      paddingLeft: 24,
      paddingRight: 24,
      background: theme.color.blueberry600,
      paddingBottom: 32,
    },
  }),
})
