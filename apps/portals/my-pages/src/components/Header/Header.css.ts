import { theme } from '@island.is/island-ui/theme'
import {
  SERVICE_PORTAL_HEADER_HEIGHT_LG,
  SERVICE_PORTAL_HEADER_HEIGHT_SM,
  zIndex,
} from '@island.is/portals/my-pages/constants'
import { globalStyle, style } from '@vanilla-extract/css'
export const header = style({
  position: 'fixed',
  display: 'flex',
  width: '100%',
  left: 0,
  right: 0,
  top: 0,
  margin: '0 auto',
  height: SERVICE_PORTAL_HEADER_HEIGHT_LG,
  zIndex: zIndex.header,
  backgroundColor: theme.color.blue100,
  alignItems: 'center',
  opacity: 1,
  transform: 'translateY(0%)',
  transition:
    'opacity 250ms cubic-bezier(0.4, 0.0, 0.2, 1), transform 250ms cubic-bezier(0.4, 0.0, 0.2, 1), visibility 0ms',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      height: SERVICE_PORTAL_HEADER_HEIGHT_SM,
    },
  },
})

export const hideHeader = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      transform: `translateY(-280%)`,
      transition:
        'opacity 250ms cubic-bezier(0.4, 0.0, 0.2, 1), transform 250ms cubic-bezier(0.4, 0.0, 0.2, 1), visibility 0ms',
      transitionDelay: '100ms',
    },
  },
})

export const showHeader = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      transform: `translateY(0%)`,
      transition:
        'opacity 250ms cubic-bezier(0.4, 0.0, 0.2, 1), transform 250ms cubic-bezier(0.4, 0.0, 0.2, 1), visibility 0ms',
      transitionDelay: '100ms',
    },
  },
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

export const overview = style({})

globalStyle(`${overview} svg`, {
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm - 1}px)`]: {
      marginLeft: '0 !important',
    },
  },
})

export const search = style({
  maxWidth: '286px',
})
