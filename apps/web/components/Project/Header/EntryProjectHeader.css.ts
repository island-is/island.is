import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const headerBg = style({
  ...themeUtils.responsiveStyle({
    xs: {
      background: '#5378A3',
      minHeight: 410,
      height: 'max-content',
    },
    sm: {
      height: 410,
    },
    lg: {
      background: `linear-gradient(90deg, rgba(83, 120, 163, 1) 0%, rgba(83, 120, 163, 1) 45%, rgba(83, 120, 163, 0) 70%),
        url('https://images.ctfassets.net/8k0h54kbe6bj/23mtVNNLYFKe32AA4elSYn/825f448f4855ebbcf0d9797a7573840b/Mynd__1_.svg'),
        linear-gradient(0deg, #5378A3 0%, #5378A3 100%)`,
      //background: `linear-gradient(99.09deg, #003D85 23.68%, #4E8ECC 123.07%),
      //  linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0, 0, 0, 0) 70%),
      //  url('https://images.ctfassets.net/8k0h54kbe6bj/47lCoLCMeg5tCuc6HXbKyg/dc0ca3f94f536ad62e40398baa90db04/Group.svg')`,
      backgroundRepeat: 'no-repeat !important',
      backgroundPositionY: '75%',
      backgroundPositionX: '0%, 10%',
      backgroundSize: '100%, 130% !important',
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
  }),
  height: 'fit-content',
  background:
    'linear-gradient(90deg, rgba(83, 120, 163, 0.1) 0%, rgba(83, 120, 163, 0.6) 15%, rgba(83, 120, 163, 0.3) 90%, rgba(83, 120, 163, 0.1) 100%)',
})

export const headerWrapper = style({})
