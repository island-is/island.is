import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const item = style({
  display: 'block',
  width: '100%',
  textAlign: 'left',
  padding: theme.spacing[2],
  borderRadius: theme.border.radius.md,
  border: `${theme.border.width.standard}px solid transparent`,
  background: 'transparent',
  cursor: 'pointer',
  transition: 'background-color 150ms ease, border-color 150ms ease',
  selectors: {
    '&:hover': {
      backgroundColor: theme.color.blue100,
      borderColor: theme.color.blue200,
    },
    '&:focus-visible': {
      outline: `${theme.border.width.large}px solid ${theme.color.blue400}`,
      outlineOffset: '2px',
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
})

export const itemActive = style({
  backgroundColor: theme.color.blue100,
  borderColor: theme.color.blue200,
})

/** Titles are one line, the rest of a long question is cut off */
export const itemTitle = style({
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const list = style({
  maxHeight: '420px',
  overflowY: 'auto',
  overscrollBehavior: 'contain',
})
