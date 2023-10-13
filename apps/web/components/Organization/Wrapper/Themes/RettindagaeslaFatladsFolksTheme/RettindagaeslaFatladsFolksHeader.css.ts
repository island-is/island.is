// trigger
import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const headerBg = style({
  background: 'linear-gradient(rgba(242, 247, 255, 0), rgba(242, 247, 255, 1))',
  ...themeUtils.responsiveStyle({
    xs: {
      height: 425,
    },
    sm: {
      height: 460,
    },
    md: {
      height: 475,
    },
    lg: {
      height: 255,
    },
  }),
})

export const mobileHeaderTitle = style({
  textAlign: 'center',
})

export const image = style({
  ...themeUtils.responsiveStyle({
    xs: {
      maxHeight: 150,
      maxWidth: 330,
    },
    sm: {
      maxHeight: 225,
      maxWidth: 500,
    },
    lg: {
      maxHeight: 255,
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
