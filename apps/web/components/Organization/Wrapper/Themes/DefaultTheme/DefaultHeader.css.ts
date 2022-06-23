import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const gridContainer = style({
  display: 'grid',
  ...themeUtils.responsiveStyle({
    xs: {
      gridTemplateRows: '200px 255px',
    },
    lg: {
      gridTemplateRows: '255px',
      gridTemplateColumns: '65fr 35fr',
    },
  }),
})

export const textContainer = style({
  textAlign: 'center',
  ...themeUtils.responsiveStyle({
    xs: {
      order: 1,
      minHeight: '255px',
      paddingTop: '32px',
    },
    lg: {
      order: 0,
      display: 'grid',
      placeItems: 'center',
      textAlign: 'left',
      paddingTop: '0px',
    },
  }),
})

export const textInnerContainer = style({
  ...themeUtils.responsiveStyle({
    lg: {
      height: '100%',
      maxWidth: '50%',
      transform: 'translateX(50%)',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingLeft: '16px',
      paddingRight: '16px',
    },
  }),
})

export const headerImage = style({
  height: '100%',
  width: '100%',
  objectFit: 'cover',
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
  bottom: '-32px',
  left: '7%',
  display: 'grid',
  placeItems: 'center',
})

export const logo = style({
  width: '70px',
  height: '70px',
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
