import { style } from '@vanilla-extract/css'
import { blueberry100, themeUtils } from '@island.is/island-ui/theme'

export const headerBg = style({
  height: 385,
  marginTop: -130,
  backgroundBlendMode: 'saturation',
  ...themeUtils.responsiveStyle({
    xs: {
      background: `linear-gradient(263.52deg, #0C588D 0%, #2A8DD2 105.7%),
        linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0, 0, 0, 0) 70%)`,
    },
    lg: {
      background: `linear-gradient(263.52deg, #0C588D 0%, #2A8DD2 105.7%),
        linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0, 0, 0, 0) 70%)`,
      backgroundRepeat: 'no-repeat !important',
      backgroundPosition: '25% 0% !important',
      backgroundSize: '100%, 100% !important',
    },
  }),
})

export const headerContainer = style({
  position: 'initial',
  paddingTop: 130,
  height: 385,
  ...themeUtils.responsiveStyle({
    lg: {
      background: `url('https://images.ctfassets.net/8k0h54kbe6bj/5anBvilgXGuY2ttEAMbzv2/6532c028aaa3c10fd9b5132ccb26c2ca/sjukra.svg')`,
      backgroundRepeat: 'no-repeat !important',
      backgroundPosition: '7% 5% !important',
      backgroundSize: '52% !important',
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
