import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'
import { themeUtils } from '@island.is/island-ui/theme'

export const footerBg = style({
  background: 'linear-gradient(272.58deg, #009D9D -2.52%, #07495D 92.41%)',
})

export const logoStyle = style({
  width: 80,
})

export const footerItemFirst = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.lg}px)`]: {
      maxWidth: 'none',
      flexBasis: '100%',
    },
  },
})

globalStyle(`${footerBg} a`, {
  color: 'white',
  textDecoration: 'underline',
  fontSize: '14px',
  textUnderlineOffset: '5px',
})

globalStyle(`${footerBg} a:hover`, {
  textDecorationThickness: '2px',
})

export const textContainer = style({
  ...themeUtils.responsiveStyle({
    xs: {
      marginLeft: 5,
    },
    sm: {
      marginLeft: 5,
    },
    md: {
      marginLeft: 5,
    },
  }),
})
