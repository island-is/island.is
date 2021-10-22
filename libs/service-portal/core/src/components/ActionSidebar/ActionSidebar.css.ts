import { keyframes, style } from '@vanilla-extract/css'
import { zIndex } from '@island.is/service-portal/constants'
import { themeUtils } from '@island.is/island-ui/theme'

export const actionSidebarTransitionTiming = 400

const sidebarAnimation = keyframes({
  '0%': { transform: 'translate3d(120%, 0, 0)' },
  '100%': { transform: 'translate3d(0%, 0, 0)' },
})

export const sidebar = style({
  zIndex: zIndex.notificationSidebar,
  minWidth: 300,
  maxWidth: '100%',
  transition: `transform ease ${actionSidebarTransitionTiming}ms`,
  animation: `${sidebarAnimation} ease ${actionSidebarTransitionTiming}ms`,
  ...themeUtils.responsiveStyle({
    md: {
      maxWidth: 650,
    },
  }),
})

export const sidebarExit = style({
  transform: 'translate3d(120%, 0, 0)',
})

const overlayAnimation = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
})

export const overlay = style({
  zIndex: zIndex.notificationSidebar - 1,
  background: 'rgba(0, 0, 0, 0.1)',
  transition: `opacity linear ${actionSidebarTransitionTiming}ms`,
  animation: `${overlayAnimation} linear ${actionSidebarTransitionTiming}ms`,
})

export const overlayExit = style({
  opacity: 0,
})

export const close = style({
  position: 'absolute',
  top: 15,
  right: 15,
  zIndex: 2,
  ...themeUtils.responsiveStyle({
    md: {
      top: 0,
      right: 'auto',
      left: -64,
    },
  }),
})

export const scrollWrapper = style({
  position: 'relative',
  height: '100%',
  maxHeight: '100vh',
  overflowY: 'auto',
})
