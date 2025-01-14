import { theme } from '@island.is/island-ui/theme'
import {
  SERVICE_PORTAL_HEADER_HEIGHT_LG,
  SERVICE_PORTAL_HEADER_HEIGHT_SM,
  zIndex,
} from '@island.is/portals/my-pages/constants'
import { globalStyle, style } from '@vanilla-extract/css'

export const header = style({
  position: 'fixed',
  zIndex: zIndex.header,
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: SERVICE_PORTAL_HEADER_HEIGHT_SM,
  margin: '0 auto',
  backgroundColor: theme.color.blue100,
  transform: 'translateY(0)',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      position: 'relative',
      height: SERVICE_PORTAL_HEADER_HEIGHT_LG,
    },
  },
})

export const fixedHeader = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      position: 'fixed',
      transform: 'translateY(0)',
      top: 0,
      transition: 'transform 550ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    },
  },
})

export const hideHeader = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      position: 'fixed',
      transform: 'translateY(-100%)',
      transition: 'transform 550ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      top: 0,
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
