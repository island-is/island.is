import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'
import { escapeGrid } from '@island.is/island-ui/utils'

const headerHeight = 112

export const root = style({
  minHeight: '-webkit-fill-available',
  display: 'flex',
  background: theme.color.white,

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      minHeight: `calc(100vh - ${headerHeight}px)`,
      background: theme.color.purple100,
    },
  },
})

export const shellContainer = style({
  order: 2,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      order: 1,
      minHeight: '800px',
    },
  },
})

export const sidebarContainer = style({
  order: 1,
  position: 'sticky',
  top: 0,

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      order: 2,
      position: 'relative',
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

export const link = style({
  ':hover': {
    textDecoration: 'none',
  },
})
