import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

export const gridContainer = style({
  display: 'grid',
  maxWidth: '1342px',
  margin: '0 auto',
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateRows: '315px',
      gridTemplateColumns: '65fr 35fr',
    },
  }),
})

export const gridContainerSubpage = style({
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateRows: 'auto',
      gridTemplateColumns: '100fr',
    },
  }),
})

export const gridContainerWidth = style({
  maxWidth: '1342px',
  margin: '0 auto',
})

export const textContainer = style({
  textAlign: 'center',
  ...themeUtils.responsiveStyle({
    xs: {
      order: 1,
      minHeight: '255px',
      paddingTop: '32px',
      paddingBottom: '20px',
    },
    lg: {
      order: 0,
      display: 'grid',
      placeItems: 'left',
      textAlign: 'left',
      paddingTop: '0px',
    },
  }),
})

export const textContainerSubpage = style({
  ...themeUtils.responsiveStyle({
    xs: {
      minHeight: '90px',
      paddingLeft: '15px',
      paddingRight: '15px',
      paddingTop: '15px',
      paddingBottom: '15px',
      textAlign: 'left',
    },
    lg: {
      minHeight: '115px',
      paddingTop: '15px',
      paddingLeft: '0px',
      paddingRight: '0px',
    },
  }),
})

export const textInnerContainer = style({
  ...themeUtils.responsiveStyle({
    lg: {
      height: '100%',
      maxWidth: '100%',
      display: 'flex',
      alignItems: 'flex-end',
      paddingLeft: '60px',
      paddingRight: '16px',
      paddingBottom: '105px',
      justifyContent: 'center',
    },
  }),
})

export const textInnerContainerSubpage = style({
  ...themeUtils.responsiveStyle({
    lg: {
      paddingLeft: '288px',
      paddingBottom: '0',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    xs: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }),
})

export const headerImage = style({
  width: '100%',
  maxHeight: '100%',
  ...themeUtils.responsiveStyle({
    xs: {
      order: 0,
    },
    lg: {
      order: 1,
    },
  }),
})

export const logoContainer = style({
  width: '136px',
  height: '136px',
  boxShadow: '0px 4px 30px rgba(0, 97, 255, 0.08)',
  position: 'absolute',
  bottom: '-92px',
  left: '7%',
  display: 'grid',
  placeItems: 'center',
  zIndex: 1,
})

export const logoContainerSubpage = style({
  bottom: '-48px',
})

export const logo = style({
  width: '70px',
  height: '70px',
})

export const logoSubpage = style({
  width: '30px',
  height: '30px',
})

export const contentContainer = style({
  maxWidth: '1440px',
  width: '100%',
  height: '255px',
  position: 'absolute',
  left: '50%',
  transform: 'translate(-50%, 0)',
  paddingLeft: '48px',
  paddingRight: '48px',
})

export const contentContainerSubpage = style({
  height: '115px',
})

export const innerContentContainer = style({
  width: '100%',
  height: '100%',
  margin: '0 auto',
  position: 'relative',
})

export const logoContainerMobile = style({
  width: '136px',
  height: '136px',
  boxShadow: '0px 4px 30px rgba(0, 97, 255, 0.08)',
  display: 'grid',
  placeItems: 'center',
  margin: '0 auto',
  marginBottom: '4px',
})

export const logoContainerMobileSubpage = style({
  width: '60px',
  height: '60px',
  marginBottom: '0px',
})

export const title = style({
  zIndex: 0,
})

export const titleSubpage = style({
  ...themeUtils.responsiveStyle({
    xs: {
      paddingLeft: theme.spacing[2],
    },
    lg: {
      paddingLeft: 0,
    },
  }),
})

export const titleText = style({
  ...themeUtils.responsiveStyle({
    lg: {
      fontSize: '34px',
    },
  }),
})
