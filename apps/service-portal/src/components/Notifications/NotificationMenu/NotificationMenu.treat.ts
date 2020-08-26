import { style } from 'treat'
import {
  SERVICE_PORTAL_HEADER_HEIGHT_LG,
  SERVICE_PORTAL_HEADER_HEIGHT_SM,
  zIndex,
} from '@island.is/service-portal/constants'
import { theme, themeUtils } from '@island.is/island-ui/theme'

const width = 410
const top = theme.spacing['2']

export const wrapper = style({
  position: 'fixed',
  top: SERVICE_PORTAL_HEADER_HEIGHT_SM,
  right: 0,
  opacity: 0,
  zIndex: zIndex.notificationSidebar,
  visibility: 'hidden',
  transition: 'opacity 200ms',
  ...themeUtils.responsiveStyle({
    md: {
      position: 'absolute',
      top: `calc(100% + ${top}px)`,
      zIndex: 2,
    },
  }),
})

export const active = style({
  zIndex: 1,
  opacity: 1,
  visibility: 'visible',
})

export const inner = style({
  width: width,
  maxWidth: '100vw',
  maxHeight: `calc(100vh - ${SERVICE_PORTAL_HEADER_HEIGHT_LG}px - ${top}px)`,
  overflowY: 'auto',
  ...themeUtils.responsiveStyle({
    md: {
      maxHeight: `calc(100vh - ${SERVICE_PORTAL_HEADER_HEIGHT_LG}px - ${top}px)`,
    },
  }),
})

export const sticky = style({
  position: 'sticky',
})
