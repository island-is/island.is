import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

import {
  DESKTOP_HEADER_HEIGHT,
  DESKTOP_HEIGHT,
  MOBILE_HEADER_HEIGHT,
  MOBILE_HEIGHT,
} from '../../../components/ServiceWeb/constants'

export const searchSection = style({
  position: 'absolute',
  top: DESKTOP_HEADER_HEIGHT + 60,
  height: MOBILE_HEIGHT - DESKTOP_HEADER_HEIGHT,
  width: '100%',
  ...themeUtils.responsiveStyle({
    lg: {
      height: DESKTOP_HEIGHT - MOBILE_HEADER_HEIGHT,
      top: MOBILE_HEADER_HEIGHT,
    },
    md: {
      height: MOBILE_HEIGHT - DESKTOP_HEADER_HEIGHT,
    },
  }),
})
