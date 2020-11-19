import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'
import { escapeGrid } from '@island.is/island-ui/utils'

export const root = style({
  minHeight: '-webkit-fill-available',
  display: 'flex',
  flexDirection: 'column',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      minHeight: '100vh',
    },
  },
})

export const rootApplying = style({
  background: theme.color.white,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      background: theme.color.purple100,
    },
  },
})

export const rootApproved = style({
  background: theme.color.white,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      background: theme.color.mint100,
    },
  },
})
export const rootPending = style({
  background: theme.color.white,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      background: theme.color.roseTinted100,
    },
  },
})
export const rootRejected = style({
  background: theme.color.white,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      background: theme.color.dark100,
    },
  },
})
export const rootReviewing = style({
  background: theme.color.white,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      background: theme.color.blue100,
    },
  },
})

export const shellContainer = style({
  order: 2,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      order: 1,
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

export const sidebarInner = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      ...escapeGrid(),
    },
  },
})
