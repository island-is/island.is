import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const headerBg = style({
  height: 385,
  marginTop: -130,
  paddingTop: 130,
  background: '#9CCBD0',

  ...themeUtils.responsiveStyle({
    sm: {
      backgroundImage: 'none',
    },
    xs: {
      backgroundImage: 'none',
    },
    md: {
      backgroundImage: 'none',
    },
    lg: {
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url('https://images.ctfassets.net/8k0h54kbe6bj/5pAFV6h9PVzSTQgJY67rbT/3117436e3043bebf720b2f9a7e7619b8/hms-header-image.svg')`,
      backgroundPosition: '105% bottom',
    },
    xl: {
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url('https://images.ctfassets.net/8k0h54kbe6bj/5pAFV6h9PVzSTQgJY67rbT/3117436e3043bebf720b2f9a7e7619b8/hms-header-image.svg')`,
      backgroundPosition: '95% bottom',
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

const titleStyles = themeUtils.responsiveStyle({
  md: {
    marginLeft: -48,
    marginTop: 30,
  },
  lg: {
    width: '55%',
    marginLeft: -80,
    marginTop: 24,
  },
  xl: {
    width: '80%',
    marginLeft: -135,
    marginTop: 24,
  },
})

export const title = style({
  ...titleStyles,
  '@media': {
    ...titleStyles?.['@media'],
    'screen and (min-width: 2000px)': {
      marginLeft: -128,
      width: '70%',
      marginTop: 24,
    },
  },
})
