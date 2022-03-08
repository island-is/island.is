import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const hands = style({
  position: 'absolute',
  pointerEvents: 'none',
  background:
    'url("https://images.ctfassets.net/8k0h54kbe6bj/3KcHfnQ0XGnd3CZUgCMyev/4462bf6ae4d09e6ad5a960b66d98e1bb/image_3.png")',
  backgroundPosition: 'bottom right',
  backgroundRepeat: 'no-repeat',
  height: '385px',
  width: '100%',
  display: 'none',
  marginTop: '25px',
  ...themeUtils.responsiveStyle({
    lg: {
      display: 'block',
    },
    xl: {
      display: 'block',
      backgroundPositionX: '90%',
    },
  }),
})

export const headerBg = style({
  background: 'linear-gradient(94.79deg, #0064AB 44.28%, #0376C7 94.91%)',
  ...themeUtils.responsiveStyle({
    xs: {
      minHeight: 410,
      height: 'max-content',
    },
    sm: {
      height: 410,
    },
  }),
})

export const textBox = style({
  minHeight: 410,
  ...themeUtils.responsiveStyle({
    xs: {
      marginBottom: 32,
    },
    md: {
      marginBottom: 0,
    },
    lg: {
      maxWidth: '400px',
    },
    xl: {
      maxWidth: '100%',
    },
  }),
  height: 'fit-content',
})
