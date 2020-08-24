import { style } from 'treat'
import { SERVICE_PORTAL_HEADER_HEIGHT_LG } from '@island.is/service-portal/constants'
import { theme } from '@island.is/island-ui/theme'

const width = 410
const top = theme.spacing['2']

export const wrapper = style({
  position: 'absolute',
  top: `calc(100% + ${top}px)`,
  right: 0,
  zIndex: 2,
  opacity: 0,
  visibility: 'hidden',
  transition: 'opacity 200ms',
})

export const active = style({
  zIndex: 1,
  opacity: 1,
  visibility: 'visible',
})

export const inner = style({
  width: width,
  maxHeight: `calc(100vh - ${SERVICE_PORTAL_HEADER_HEIGHT_LG}px - ${top}px)`,
  overflowY: 'auto',
})

export const sticky = style({
  position: 'sticky',
})
