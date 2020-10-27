import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'
import { escapeGrid } from '@island.is/island-ui/utils'

export const root = style({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',

  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      // https://github.com/seek-oss/treat/issues/120
      minHeight: '-webkit-fill-available',
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

export const largeSidebarContainer = style({
  order: 1,

  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      ...escapeGrid(),

      maxWidth: `calc(100% + ${theme.grid.gutter.mobile * 4}px)`,
    },

    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      order: 2,
    },
  },
})
