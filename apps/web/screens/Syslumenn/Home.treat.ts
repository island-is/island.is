import { style } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const headerBg = style({
  background: '#252973',
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
      marginTop: -60,
    },
  }),
})

export const intro = style({
  fontWeight: 300,
  fontSize: 20,
  lineHeight: 28 / 20,
  ...themeUtils.responsiveStyle({
    sm: {
      fontSize: 24,
      lineHeight: 34 / 24,
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

export const desktopNav = style({
  marginTop: -230,
})

export const mobileNav = style({
  marginTop: -20,
})
