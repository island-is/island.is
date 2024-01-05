import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'
import {
  STICKY_NAV_HEIGHT,
  STICKY_NAV_MAX_WIDTH,
} from '@island.is/web/constants'

const top = STICKY_NAV_HEIGHT + theme.spacing[1]

export const sidebarWrapper = style({
  top,
  maxWidth: '230px',
  minWidth: '230px',
  ...themeUtils.responsiveStyle({
    lg: {
      minWidth: `${STICKY_NAV_MAX_WIDTH}px`,
      maxWidth: `${STICKY_NAV_MAX_WIDTH}px`,
    },
  }),
})

export const sticky = style({
  position: 'sticky',
  alignSelf: 'flex-start',
})
