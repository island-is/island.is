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

export const popularTitleWrap = style({
  ...themeUtils.responsiveStyle({
    md: {
      maxWidth: '315px',
      textAlign: 'center',
      margin: '0 auto',
    },
  }),
})

export const popularTitle = style({
  fontSize: 34,
  lineHeight: 44 / 34,
  fontWeight: 600,
  marginBottom: 30,
})

export const districtsTitle = style({
  fontWeight: 600,
  fontSize: 20,
  lineHeight: 28 / 20,
  ...themeUtils.responsiveStyle({
    sm: {
      fontSize: 24,
      lineHeight: 34 / 24,
    },
  }),
})

export const districtsList = style({
  columnGap: 30,
  ...themeUtils.responsiveStyle({
    xs: {
      columnCount: 1,
      marginTop: 40,
      marginBottom: 40,
    },
    md: {
      columnCount: 2,
      marginTop: 75,
    },
    lg: { columnCount: 3 },
    xl: { columnCount: 3 },
  }),
})

export const districtsListItem = style({
  marginBottom: 32,
})

export const newsBg = style({
  background: '#F8F5FA',
})
