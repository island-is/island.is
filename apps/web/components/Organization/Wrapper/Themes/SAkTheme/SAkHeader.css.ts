import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

const illustrationUrl =
  'https://images.ctfassets.net/8k0h54kbe6bj/4pc9qYq6XwYKSJAqfE4R8q/aee925ec527298733fe02b54330e380b/Group_1306.png'

export const headerBg = style({
  height: 385,
  marginTop: -130,
  paddingTop: 130,
  backgroundRepeat: 'no-repeat, no-repeat',
  ...themeUtils.responsiveStyle({
    xs: {
      backgroundSize: 'cover',
      backgroundImage: `linear-gradient(90deg, #00498E 0%, #3A81D8 100.87%)`,
    },
    xl: {
      backgroundPosition: 'bottom right',
      backgroundSize: '570px, contain',
      backgroundImage: `url(${illustrationUrl}), linear-gradient(90deg, #00498E 0%, #3A81D8 100.87%)`,
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
      marginTop: '50px',
    },
  }),
})
