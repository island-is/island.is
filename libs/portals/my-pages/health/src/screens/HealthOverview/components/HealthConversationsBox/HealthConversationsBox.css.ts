import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const lock = style({
  position: 'absolute',
  zIndex: 1,
  top: theme.spacing[2],
  right: theme.spacing[3],
})

export const unreadRow = style({
  backgroundColor: theme.color.blueberry100,
})

export const stateImage = style({
  height: 180,
})

export const conversationLink = style({
  display: 'block',
  textDecoration: 'none',
  ':focus-visible': {
    outline: `3px solid ${theme.color.mint400}`,
    outlineOffset: -3,
  },
})

export const headerLink = style({
  display: 'flex',
  borderRadius: theme.border.radius.standard,
  ':focus-visible': {
    outline: `3px solid ${theme.color.mint400}`,
    outlineOffset: 2,
  },
})

export const firstRow = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md - 1}px)`]: {
      selectors: {
        '&&': {
          borderTopWidth: 0,
        },
      },
    },
  },
})
