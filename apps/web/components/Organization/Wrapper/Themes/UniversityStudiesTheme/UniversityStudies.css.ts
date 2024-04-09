import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

const backgroundImageUrl =
  'https://images.ctfassets.net/8k0h54kbe6bj/4dlQwaChrcgyRLTSJ0CsPM/7d83caf105d1c665a5d1ae2ff28ba89e/herobanner_haskolanam.svg'

export const headerBg = style({
  position: 'relative',
  ...themeUtils.responsiveStyle({
    xs: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 340,
      background:
        'linear-gradient(90deg, #C1EDDF 0%, #FDE1AD 79%) center/cover',
    },
    md: {
      display: 'block',
      justifyContent: 'unset',
      alignItems: 'unset',
      height: 340,
      backgroundImage: `url(${backgroundImageUrl})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '992px',
      backgroundPosition: 'center',
    },
    lg: {
      height: 444,
      backgroundImage: `url(${backgroundImageUrl})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'unset',
      backgroundPosition: 'center',
    },
    xl: {
      backgroundImage: `url(${backgroundImageUrl})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '1440px',
      backgroundPosition: 'center',
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
  zIndex: 1000,
  ...themeUtils.responsiveStyle({
    xs: {
      marginTop: 32,
    },
    md: {
      marginTop: 168,
      position: 'relative',
    },
    lg: {
      marginTop: 265,
      position: 'relative',
    },
    xl: {
      marginTop: 280,
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
  marginTop: -30,
})

export const headerLogo = style({
  width: 120,
  maxHeight: 120,
})

export const footerLogo = style({
  marginBottom: -30,
  width: 180,
  maxHeight: 180,
  padding: '2rem 0',
})

export const footerContainer = style({
  ...themeUtils.responsiveStyle({
    xl: {
      maxWidth: '1440px',
    },
  }),
})

export const footerLinksContainer = style({
  padding: '2rem 0',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: '2.5rem',
  ...themeUtils.responsiveStyle({
    md: {
      flexDirection: 'row',
      padding: '3rem 0',
      justifyContent: 'flex-start',
    },
  }),
})

export const ellipsisLeft = style({
  height: '100%',
  width: '12.5rem',
  borderRadius: '55.5rem',
  background: '#E1E9FD',
  filter: 'blur(66px)',
  top: 0,
  left: 40,
  zIndex: '-1',
  ...themeUtils.responsiveStyle({
    md: {
      width: '50%',
      height: '12.5rem',
      borderRadius: '55.5rem',
      top: 40,
      left: 0,
    },
  }),
})

export const ellipsisRight = style({
  height: '100%',
  width: '12.5rem',
  borderRadius: '55.5rem',
  background: '#FDECE7',
  filter: 'blur(66px)',
  zIndex: '-1',
  top: 0,
  right: 40,
  ...themeUtils.responsiveStyle({
    md: {
      width: '50%',
      height: '12.5rem',
      borderRadius: '55.5rem',
      top: 40,
      right: 0,
    },
  }),
})

export const footerFirstColumnContainer = style({
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  width: '17rem',
  height: '100%',
  gap: '1.5rem',
})

export const footerSecondColumnContainer = style({
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  width: '17rem',
  gap: '1.5rem',
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
