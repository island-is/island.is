import { theme } from '@island.is/island-ui/theme'
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
  width: 'calc(100vw - 32px)',
  maxWidth: 1440,
  maxHeight: 'calc(100vh - 32px)',
  margin: `${theme.spacing[2]}px auto`,
  overflowY: 'auto',
  background: theme.color.white,
  borderRadius: theme.border.radius.standard,
  boxShadow: theme.shadows.large,
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
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      order: 2,
    },
  },
})
