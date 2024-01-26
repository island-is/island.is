import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const headerBg = style({
  position: 'relative',
  ...themeUtils.responsiveStyle({
    xs: {},
    md: {
      height: 340,
      marginTop: 16,
    },
    lg: {
      height: 444,
      marginTop: 16,
    },
    xl: {
      marginTop: 24,
      height: 480,
    },
  }),
})

export const iconCircle = style({
  height: 136,
  width: 136,
  background: '#fff',
  borderRadius: '50%',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0px 4px 30px rgba(0, 97, 255, 0.08)',
  ...themeUtils.responsiveStyle({
    xs: {
      marginTop: 32,
    },
    md: {
      marginTop: 168,
      position: 'relative',
    },
  }),
})

export const headerBorder = style({
  ...themeUtils.responsiveStyle({
    xs: {
      marginTop: 32,
    },
    md: {
      borderBottom: '4px solid #ffbe43',
    },
  }),
})

export const headerWrapper = style({
  marginTop: -20,
})

export const headerLogo = style({
  width: 70,
  maxHeight: 70,
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

export const desktopTitleContainer = style({
  ...themeUtils.responsiveStyle({
    xl: {
      display: 'flex',
      justifyContent: 'center',
    },
  }),
})

export const desktopTitle = style({
  ...themeUtils.responsiveStyle({
    xl: {
      transform: 'translate(-150px, 165px)',
    },
  }),
})
