import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

import {
  DESKTOP_HEADER_HEIGHT,
  DESKTOP_HEIGHT,
  MOBILE_HEADER_HEIGHT,
  MOBILE_HEIGHT,
} from '../../../components/ServiceWeb/constants'

export const bg = style({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: -1,
  height: MOBILE_HEIGHT,
  backgroundBlendMode: 'saturation',
  background: `linear-gradient(99.09deg, #003D85 23.68%, #4E8ECC 123.07%),
    linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0, 0, 0, 0) 70%),
    url('https://images.ctfassets.net/8k0h54kbe6bj/47lCoLCMeg5tCuc6HXbKyg/dc0ca3f94f536ad62e40398baa90db04/Group.svg')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center, center center, 20% -17%',
  backgroundSize: '100%, 100%, 90% 150%',
  ...themeUtils.responsiveStyle({
    lg: {
      height: DESKTOP_HEIGHT,
    },
  }),
})

export const bgSmall = style({
  height: MOBILE_HEADER_HEIGHT,
  backgroundPosition: 'center center, center center, 0 17%',
  backgroundSize: '100%, 100%, 100%',
  ...themeUtils.responsiveStyle({
    lg: {
      height: DESKTOP_HEADER_HEIGHT,
    },
  }),
})
