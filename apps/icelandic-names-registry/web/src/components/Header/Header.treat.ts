import { style } from 'treat'
import {
  SERVICE_PORTAL_HEADER_HEIGHT_LG,
  SERVICE_PORTAL_HEADER_HEIGHT_SM,
  zIndex,
} from '@island.is/service-portal/constants'
import { theme } from '@island.is/island-ui/theme'

export const header = style({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: zIndex.header,
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: SERVICE_PORTAL_HEADER_HEIGHT_SM,
  backgroundColor: theme.color.white,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      height: SERVICE_PORTAL_HEADER_HEIGHT_LG,
    },
  },
})

export const placeholder = style({
  height: SERVICE_PORTAL_HEADER_HEIGHT_SM,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      height: SERVICE_PORTAL_HEADER_HEIGHT_LG,
    },
  },
})
