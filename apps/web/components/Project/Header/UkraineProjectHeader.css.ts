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
  position: 'relative',
  display: 'flex',
  flexFlow: 'column nowrap',
  background: 'linear-gradient(94.79deg, #0064AB 44.28%, #0376C7 94.91%)',
  minHeight: 410,
  overflow: 'hidden',
})

export const textBox = style({
  ...themeUtils.responsiveStyle({
    lg: {
      maxWidth: '400px',
    },
    xl: {
      maxWidth: '100%',
    },
  }),
})

export const handsMobileContainer = style({
  alignSelf: 'center',
  justifySelf: 'flex-end',
})

export const handsMobile = style({
  maxHeight: '200px',
  marginBottom: '-20px',
  pointerEvents: 'none',
  objectFit: 'cover',
})
