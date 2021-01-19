import { style } from 'treat'
import { themeUtils } from '@island.is/island-ui/theme'

export const headerBg = style({
  background: '#252973',
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
      marginTop: -60,
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

export const mobileNav = style({
  marginTop: -20,
})
