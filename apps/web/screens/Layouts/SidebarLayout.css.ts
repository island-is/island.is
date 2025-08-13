import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'
import {
  STICKY_NAV_HEIGHT,
  STICKY_NAV_MAX_WIDTH_DEFAULT,
  STICKY_NAV_MAX_WIDTH_LG,
} from '@island.is/web/constants'

const top = STICKY_NAV_HEIGHT + theme.spacing[1]

export const sidebarWrapper = style({
  top,
  maxWidth: `${STICKY_NAV_MAX_WIDTH_DEFAULT}px`,
  minWidth: `${STICKY_NAV_MAX_WIDTH_DEFAULT}px`,
  ...themeUtils.responsiveStyle({
    lg: {
      minWidth: `${STICKY_NAV_MAX_WIDTH_LG}px`,
      maxWidth: `${STICKY_NAV_MAX_WIDTH_LG}px`,
    },
  }),
})

export const contentWrapper = style({
  ...themeUtils.responsiveStyle({
    md: {
      maxWidth: `calc(100% - ${STICKY_NAV_MAX_WIDTH_DEFAULT}px)`,
    },
    lg: {
      maxWidth: `calc(100% - ${STICKY_NAV_MAX_WIDTH_LG}px)`,
    },
  }),
})

export const sticky = style({
  position: 'sticky',
  alignSelf: 'flex-start',
})
