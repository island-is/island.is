import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

import {
  DESKTOP_HEADER_HEIGHT,
  DESKTOP_HEIGHT,
  MOBILE_HEADER_HEIGHT,
  MOBILE_HEIGHT,
} from '../../../components/ServiceWeb/constants'

export const bg = style({
  position: 'relative',
  marginTop: -MOBILE_HEADER_HEIGHT,
  paddingTop: MOBILE_HEADER_HEIGHT,
  overflow: 'hidden',
  zIndex: -1,
  height: MOBILE_HEIGHT,
  ...themeUtils.responsiveStyle({
    md: {
      marginTop: -DESKTOP_HEADER_HEIGHT,
      paddingTop: DESKTOP_HEADER_HEIGHT,
    },
    lg: {
      marginTop: -DESKTOP_HEADER_HEIGHT,
      paddingTop: DESKTOP_HEADER_HEIGHT,
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
