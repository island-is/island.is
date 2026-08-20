import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

/** Capped at the width the conversation itself has, so that the question box
 * does not move or change size when the chat opens on top of it. */
export const content = style({
  width: '100%',
  maxWidth: '800px',
  marginLeft: 'auto',
  marginRight: 'auto',
})

/**
 * The composer is built from a plain textarea rather than the Input component,
 * so that the send button can sit inside the same rounded surface instead of
 * next to a second border.
 */
export const composer = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'flex-end',
  columnGap: theme.spacing[1],
  padding: theme.spacing[2],
  paddingLeft: theme.spacing[3],
  borderRadius: theme.border.radius.lg,
  backgroundColor: theme.color.white,
  border: `${theme.border.width.standard}px solid ${theme.color.blue200}`,
  boxShadow: theme.shadows.subtle,
  transition: 'border-color 150ms ease, box-shadow 150ms ease',
  selectors: {
    '&:focus-within': {
      borderColor: theme.color.blue400,
      boxShadow: theme.shadows.strong,
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
})

export const composerInput = style({
  flexGrow: 1,
  minWidth: 0,
  alignSelf: 'center',
  border: 0,
  outline: 0,
  resize: 'none',
  background: 'transparent',
  color: theme.color.dark400,
  fontFamily: theme.typography.fontFamily,
  fontSize: 16,
  lineHeight: 1.5,
  // Grown from the client as the visitor types, up to eight or so lines
  maxHeight: '200px',
  overflowY: 'auto',
  ...themeUtils.responsiveStyle({
    md: {
      fontSize: 18,
    },
  }),
  '::placeholder': {
    color: theme.color.dark300,
  },
})

/**
 * The suggestions are whole questions rather than labels, so they are laid out
 * as rows that read like something to press, not as pills.
 */
export const suggestion = style({
  display: 'block',
  width: '100%',
  textAlign: 'left',
  cursor: 'pointer',
  padding: theme.spacing[2],
  paddingLeft: theme.spacing[3],
  borderRadius: theme.border.radius.large,
  backgroundColor: theme.color.white,
  border: `${theme.border.width.standard}px solid ${theme.color.blue200}`,
  transition: 'background-color 150ms ease, border-color 150ms ease',
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: theme.color.blue100,
      borderColor: theme.color.blue400,
    },
    '&:focus-visible': {
      outline: `${theme.border.width.large}px solid ${theme.color.mint400}`,
      outlineOffset: '2px',
    },
    '&:disabled': {
      cursor: 'default',
      opacity: 0.5,
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
})
