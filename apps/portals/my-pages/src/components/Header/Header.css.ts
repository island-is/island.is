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
  visibility: 'visible',
  transform: 'translateY(0%)',
  transition:
    'opacity 150ms ease, transform 150ms ease, visibility 0ms linear 150ms',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      height: SERVICE_PORTAL_HEADER_HEIGHT_SM,
    },
  },
})

export const hideHeader = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      transform: `translateY(-100%)`,
      opacity: 0,
      visibility: 'hidden',
      transition:
        'opacity 250ms ease, transform 250ms ease, visibility 0ms linear 0ms',
    },
  },
})

export const showHeader = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      transform: `translateY(0%)`,
      opacity: 1,
      visibility: 'visible',
      transition:
        'opacity 250ms ease, transform 250ms ease, visibility 0ms linear 0ms',
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
