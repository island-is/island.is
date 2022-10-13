import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'
import {
  DESKTOP_HEADER_HEIGHT,
  MOBILE_HEADER_HEIGHT,
  DESKTOP_HEIGHT,
  MOBILE_HEIGHT,
} from '../../../components/ServiceWeb/constants'

export const bg = style({
  position: 'absolute',
  overflow: 'hidden',
  left: 0,
  right: 0,
  zIndex: -1,
  height: MOBILE_HEIGHT,
  ...themeUtils.responsiveStyle({
    lg: {
      height: DESKTOP_HEIGHT,
    },
  }),
})

export const bgSmall = style({
  height: MOBILE_HEADER_HEIGHT,
  ...themeUtils.responsiveStyle({
    lg: {
      height: DESKTOP_HEADER_HEIGHT,
    },
  }),
})
