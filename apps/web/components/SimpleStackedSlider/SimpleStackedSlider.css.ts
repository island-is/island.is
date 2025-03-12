import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const outer = style({
  boxSizing: 'border-box',
  overflowX: 'auto',
  overflowY: 'hidden',
  selectors: {
    [`&::-webkit-scrollbar`]: {
      display: 'none',
    },
  },
})

export const inner = style({
  display: 'inline-block',
})

export const row = style({
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
  height: 'auto',
})

export const dot = style({
  position: 'relative',
  display: 'inline-block',
  outline: 0,
  backgroundColor: theme.color.red200,
  borderRadius: 8,
  width: 8,
  height: 8,
  transition: `background-color 0.3s ease, width 0.3s ease`,
  ':after': {
    position: 'absolute',
    content: '""',
    left: -8,
    right: -8,
    top: -8,
    bottom: -8,
  },
})

export const dotActive = style({
  backgroundColor: theme.color.red400,
  width: 32,
  height: 8,
})

export const nav = style({
  position: 'absolute',
  top: 0,
  right: 0,
})

export const column = style({
  display: 'flex',
  height: 'auto',
  marginRight: 12,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      marginRight: 24,
    },
  },
})
