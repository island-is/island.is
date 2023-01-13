import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const headerBg = style({
  height: 385,
  marginTop: -130,
  paddingTop: 130,
  backgroundRepeat: 'no-repeat, no-repeat',

  ...themeUtils.responsiveStyle({
    xs: {
      backgroundSize: 'cover',
      backgroundImage:
        'url(https://images.ctfassets.net/8k0h54kbe6bj/1FB32FjyMGC1PfpDfB2Kj1/257dc1108da254359f8988dfef536936/Pattern_PP_Pattern_Circle_Blue_1.png)',
    },
    lg: {
      backgroundPositionY: 'bottom',
      backgroundPositionX: '120%, 0',
      backgroundSize: 'unset',
      backgroundImage:
        'url(https://images.ctfassets.net/8k0h54kbe6bj/2p6UWMBdVkVHBAjsnX20bY/c04b402332dbae96c198db7b8640f20b/Header_illustration_1.svg), url(https://images.ctfassets.net/8k0h54kbe6bj/1FB32FjyMGC1PfpDfB2Kj1/257dc1108da254359f8988dfef536936/Pattern_PP_Pattern_Circle_Blue_1.png)',
    },
    xl: {
      backgroundPosition: 'bottom right',
      backgroundSize: 'contain, cover',
      backgroundImage:
        'url(https://images.ctfassets.net/8k0h54kbe6bj/2p6UWMBdVkVHBAjsnX20bY/c04b402332dbae96c198db7b8640f20b/Header_illustration_1.svg), url(https://images.ctfassets.net/8k0h54kbe6bj/1FB32FjyMGC1PfpDfB2Kj1/257dc1108da254359f8988dfef536936/Pattern_PP_Pattern_Circle_Blue_1.png)',
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

export const title = style({
  ...themeUtils.responsiveStyle({
    md: {
      marginLeft: -300,
    },
    lg: {
      marginLeft: -300,
    },
    xl: {
      marginLeft: -180,
    },
  }),
})
