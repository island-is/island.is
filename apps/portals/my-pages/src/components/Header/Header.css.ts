import { globalStyle, style, styleVariants } from '@vanilla-extract/css'
import {
  SERVICE_PORTAL_HEADER_HEIGHT_LG,
  SERVICE_PORTAL_HEADER_HEIGHT_SM,
  zIndex,
} from '@island.is/portals/my-pages/constants'
import { theme, themeUtils } from '@island.is/island-ui/theme'

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

export const overview = style({})

globalStyle(`${overview} svg`, {
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm - 1}px)`]: {
      marginLeft: '0 !important',
    },
  },
})
