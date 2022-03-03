import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const bg = style({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  backgroundBlendMode: 'saturation',
  backgroundRepeat: 'no-repeat',
  background:
    'linear-gradient(99.09deg, #003D85 23.68%, #4E8ECC 123.07%), linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0, 0, 0, 0) 70%)',
  backgroundPosition: 'center center, center center',
  backgroundSize: '100%, 100%, 90% 150%',
})

export const illustration = style({
  position: 'relative',
  height: '200%',
  maxHeight: 500,
  top: 100,
  left: 'auto',
  ...themeUtils.responsiveStyle({
    md: {
      left: -30,
      maxHeight: 1000,
    },
  }),
})

export const small = style({
  bottom: 'initial',
  top: -150,
  width: 1000,
})
