import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const headerBg = style({
  zIndex: -1,
  height: 385,
  marginTop: -130,
  paddingTop: 130,
  backgroundColor: '#122771',
  backgroundRepeat: 'no-repeat',
})

export const headerImage = style({
  position: 'absolute',
  width: 733,
  top: 0,
  left: 0,
  height: 365,
  backgroundRepeat: 'no-repeat',
  opacity: 0.5,
  backgroundSize: 'contain',
  backgroundImage:
    'linear-gradient(270.1deg, rgba(18, 39, 113, 0.2) 0.08%, rgba(18, 39, 113, 0) 103.56%), url(https://images.ctfassets.net/8k0h54kbe6bj/5VPkYND5fDBou7G0jCPCtD/2019274c76468def75fd5f340d2b3031/Mynd_-_header.png)',
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
