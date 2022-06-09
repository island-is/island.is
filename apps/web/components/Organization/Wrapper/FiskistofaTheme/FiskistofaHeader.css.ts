import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const headerBg = style({
  height: 385,
  marginTop: -130,
  paddingTop: 130,
  backgroundRepeat: 'no-repeat',
  backgroundPositionX: '52%',
  backgroundPositionY: '30%',
  ...themeUtils.responsiveStyle({
    xs: {
      backgroundImage:
        'linear-gradient(180deg, #E6F2FB 21.56%, #90D9E3 239.74%)',
    },
    md: {
      backgroundImage:
        "url('https://images.ctfassets.net/8k0h54kbe6bj/7otUOlYNXerZwr0fRxkQA8/580fa8074fdb790a21e34c203658aad1/Fiskistofa-header-image.png'), linear-gradient(180deg, #E6F2FB 21.56%, #90D9E3 239.74%)",
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
