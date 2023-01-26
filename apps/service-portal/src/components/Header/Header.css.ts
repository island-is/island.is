import { style, styleVariants } from '@vanilla-extract/css'
import {
  SERVICE_PORTAL_HEADER_HEIGHT_LG,
  SERVICE_PORTAL_HEADER_HEIGHT_SM,
  zIndex,
} from '@island.is/service-portal/constants'
import { theme } from '@island.is/island-ui/theme'

export const header = style({
  position: 'fixed',
  zIndex: zIndex.header,
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: SERVICE_PORTAL_HEADER_HEIGHT_SM,
  margin: '0 auto',
  backgroundColor: theme.color.blue100,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      height: SERVICE_PORTAL_HEADER_HEIGHT_LG,
    },
  },
  transition: 'all 250ms ease-in-out',
})

export const placeholder = style({
  height: SERVICE_PORTAL_HEADER_HEIGHT_SM,
  display: 'flex',
  justifyContent: 'center',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      height: SERVICE_PORTAL_HEADER_HEIGHT_LG,
    },
  },
})

export const closeButton = style({
  ':hover': {
    backgroundColor: theme.color.blue200,
  },
})

export const badge = styleVariants({
  active: {
    position: 'absolute',
    top: 14,
    left: 88,
    height: theme.spacing[1],
    width: theme.spacing[1],
    borderRadius: '50%',
    backgroundColor: theme.color.red400,
  },
  inactive: {
    display: 'none',
  },
})
