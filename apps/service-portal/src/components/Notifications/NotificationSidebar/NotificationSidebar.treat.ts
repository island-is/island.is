import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'
import { SERVICE_PORTAL_HEADER_HEIGHT_LG } from '@island.is/service-portal/constants'

const width = 336
const breakpoint = 914 + width

export const wrapper = style({
  position: 'fixed',
  top: SERVICE_PORTAL_HEADER_HEIGHT_LG,
  right: 0,
  zIndex: 2,
  width: width,
  height: `calc(100vh - ${SERVICE_PORTAL_HEADER_HEIGHT_LG}px)`,
  flex: '0 0 auto',
  marginRight: -width,
  backgroundColor: theme.color.white,
  borderLeft: `1px solid ${theme.color.dark100}`,
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
