import { style } from 'treat'
import { blueberry100, themeUtils } from '@island.is/island-ui/theme'

export const headerBg = style({
  height: 385,
  marginTop: -130,
  background: '#F6F6FD',
})

export const headerContainer = style({
  position: 'initial',
  paddingTop: 130,
  height: 385,
  ...themeUtils.responsiveStyle({
    lg: {
      background: `url('https://images.ctfassets.net/8k0h54kbe6bj/1UwZEiLUXwiy0qyMcFQztZ/1f74ca98866e4ad7e85c45c58bf64568/image_65_shutterstock__1_.png')`,
      backgroundRepeat: 'no-repeat !important',
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
