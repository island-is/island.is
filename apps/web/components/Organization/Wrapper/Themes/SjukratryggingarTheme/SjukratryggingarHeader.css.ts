import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const headerBg = style({
  height: 385,
  marginTop: -130,
  ...themeUtils.responsiveStyle({
    xs: {
      background: '#40C5E5',
    },
    md: {
      background: `linear-gradient(184.95deg, #40C5E5 8.38%, rgba(64, 197, 227, 0.1) 39.64%, rgba(244, 247, 247, 0) 49.64%),
    linear-gradient(273.41deg, #F4F7F7 -9.24%, #40C5E5 66.78%, #A4DEF1 105.51%);`,
    },
  }),
})

export const headerContainer = style({
  position: 'initial',
  paddingTop: 130,
  height: 385,
  zIndex: 1,
  ...themeUtils.responsiveStyle({
    lg: {
      background: `url('/assets/sjukratryggingar_seniors.png')`,
      backgroundRepeat: 'no-repeat !important',
      backgroundPosition: '2% 5% !important',
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
      marginTop: 104,
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

export const trianglesLeft = style({
  position: 'absolute',
  pointerEvents: 'none',
  background: 'url("/assets/sjukratryggingar_triangles_left.png")',
  backgroundPosition: 'bottom',
  backgroundRepeat: 'no-repeat',
  height: '385px',
  width: 174,
  left: 0,
  display: 'none',
  ...themeUtils.responsiveStyle({
    xl: {
      display: 'block',
    },
  }),
})

export const trianglesRight = style({
  position: 'absolute',
  pointerEvents: 'none',
  background: 'url("/assets/sjukratryggingar_triangles_right.png")',
  backgroundPosition: 'bottom',
  backgroundRepeat: 'no-repeat',
  height: '385px',
  width: 455,
  right: 0,
  display: 'none',
  ...themeUtils.responsiveStyle({
    xl: {
      display: 'block',
    },
  }),
})

export const trianglesTop = style({
  position: 'absolute',
  pointerEvents: 'none',
  background: 'url("/assets/sjukratryggingar_triangles_top.png")',
  backgroundPosition: 'top',
  backgroundRepeat: 'no-repeat',
  height: '385px',
  width: 455,
  top: -160,
  left: 80,
  display: 'none',
  ...themeUtils.responsiveStyle({
    xl: {
      display: 'block',
    },
  }),
})

export const titleImage = style({
  height: 90,
  marginTop: -16,
  background: 'url("/assets/sjukratryggingar_title.svg")',
  backgroundRepeat: 'no-repeat',
  backgroundPositionX: 'center',
})
