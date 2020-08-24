import { style } from 'treat'
import {
  SERVICE_PORTAL_HEADER_HEIGHT_LG,
  zIndex,
} from '@island.is/service-portal/constants'

const width = 410
const breakpoint = 1200 + width

export const wrapper = style({
  position: 'fixed',
  top: SERVICE_PORTAL_HEADER_HEIGHT_LG,
  right: 0,
  zIndex: zIndex.notificationSidebar,
  width: width,
  height: `calc(100vh - ${SERVICE_PORTAL_HEADER_HEIGHT_LG}px)`,
  flex: '0 0 auto',
  marginRight: -width,
  transition: 'margin-right 400ms',
  overflowY: 'auto',
})

export const placeholder = style({
  width: width,
  flex: '0 0 auto',
  marginRight: -width,
  transition: 'margin-right 400ms',
  '@media': {
    [`screen and (max-width: ${breakpoint}px)`]: {
      display: 'none',
    },
  },
})

export const active = style({
  marginRight: 0,
})
