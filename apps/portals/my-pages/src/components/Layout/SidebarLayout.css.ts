import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'
import { SERVICE_PORTAL_HEADER_HEIGHT_LG } from '@island.is/portals/my-pages/constants'

const top = SERVICE_PORTAL_HEADER_HEIGHT_LG
// Pinned 16px below the fixed header once the page scrolls.
const stickyTop = top + theme.spacing[2]
// Set per instance by SidebarLayout so the alert/delegation banner offset feeds
// both the sticky threshold and the height left below it.
const bannerOffset = 'var(--mp-sidebar-offset, 0px)'

const sidebarWidth = {
  desktop: '318px',
  tablet: '230px',
}

export const sidebarWrapper = style({
  // Hidden below md — the mobile sub-nav in the main column takes over. Declared
  // here rather than via Box's display prop so it can't be overridden by the
  // flex layout below.
  display: 'none',
  maxWidth: sidebarWidth.tablet,
  minWidth: sidebarWidth.tablet,
  ...themeUtils.responsiveStyle({
    md: {
      display: 'flex',
      flexDirection: 'column',
    },
    lg: {
      minWidth: sidebarWidth.desktop,
      maxWidth: sidebarWidth.desktop,
    },
  }),
})

export const sticky = style({
  position: 'sticky',
  alignSelf: 'flex-start',
  zIndex: 1,
  top: `calc(${stickyTop}px + ${bannerOffset})`,
  // Cap the sidebar at the space below the header; the menu below it scrolls
  // inside itself so nothing ends up pinned out of reach.
  maxHeight: `calc(100dvh - ${stickyTop}px - ${bannerOffset})`,
})

export const sidebarWrap = style({
  minWidth: 0,
  maxWidth: '100%',
  ...themeUtils.responsiveStyle({
    md: {
      maxWidth: `calc(100% - ${sidebarWidth.tablet})`,
    },
    lg: {
      maxWidth: `calc(100% - ${sidebarWidth.desktop})`,
    },
  }),
})
