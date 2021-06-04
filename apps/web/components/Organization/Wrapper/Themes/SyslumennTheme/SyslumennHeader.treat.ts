import { style } from 'treat'
import { blueberry100, themeUtils } from '@island.is/island-ui/theme'

export const headerBg = style({
  height: 385,
  marginTop: -130,
  paddingTop: 130,
  backgroundBlendMode: 'saturation',
  ...themeUtils.responsiveStyle({
    xs: {
      background: `linear-gradient(99.09deg, #003D85 23.68%, #4E8ECC 123.07%),
        linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0, 0, 0, 0) 70%)`,
    },
    lg: {
      background: `linear-gradient(99.09deg, #003D85 23.68%, #4E8ECC 123.07%),
        linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0, 0, 0, 0) 70%),
        url('https://images.ctfassets.net/8k0h54kbe6bj/47lCoLCMeg5tCuc6HXbKyg/dc0ca3f94f536ad62e40398baa90db04/Group.svg')`,
      backgroundRepeat: 'no-repeat !important',
      backgroundPosition: '5% 25% !important',
      backgroundSize: '100%, 100%, 60% !important',
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
