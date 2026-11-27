import { theme } from '@island.is/island-ui/theme'
import { escapeGrid } from '@island.is/island-ui/utils'
import { style } from '@vanilla-extract/css'

export const footer = style({
  borderTop: `2px solid ${theme.color.purple100}`,
  borderBottomLeftRadius: theme.border.radius.large,
  borderBottomRightRadius: theme.border.radius.large,
  paddingBottom: 'calc(env(safe-area-inset-bottom) + 20px)',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      paddingBottom: theme.spacing[4],
    },
  },
})

export const previewModal = style({
  display: 'flex',
  flexDirection: 'column',
  width: 'calc(100vw - 96px)',
  maxWidth: 1200,
  height: 'calc(100dvh - 144px)',
  maxHeight: 'calc(100dvh - 144px)',
  margin: `${theme.spacing[6]}px auto`,
  overflowY: 'auto',
  background: theme.color.white,
  borderRadius: theme.border.radius.standard,
  boxShadow: theme.shadows.large,
})

export const previewHeading = style({
  outline: 'none',
})

export const application = style({
  display: 'flex',
  background: theme.color.white,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      background: theme.color.purple100,
    },
  },
})

export const shellContainer = style({
  order: 2,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      order: 1,
      minHeight: 800,
    },
  },
})

export const sidebarContainer = style({
  order: 1,
  position: 'sticky',
  top: 0,
  zIndex: 1,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      order: 2,
      position: 'relative',
      zIndex: 'auto',
    },
  },
})

export const sidebarInner = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      ...escapeGrid(),
    },
  },
})

export const viewportContainer = style({
  display: 'flex',
  flex: 1,
  minHeight: 0,
  justifyContent: 'center',
  background: theme.color.purple100,
})

export const viewport = style({
  display: 'block',
  width: '100%',
  height: '100%',
  minHeight: 0,
  border: 0,
  background: theme.color.white,
})

export const mobileViewport = style([
  viewport,
  {
    width: 390,
    maxWidth: '100%',
  },
])
