import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

/** Capped at the width the conversation itself has, so that the question box
 * does not move or change size when the chat opens on top of it. */
export const content = style({
  width: '100%',
  maxWidth: '800px',
  marginLeft: 'auto',
  marginRight: 'auto',
})

const LINE_HEIGHT = 24
const ROWS = 4

/**
 * A quiet rounded box rather than a labelled form field, with the send button
 * sitting inside it next to the question.
 */
export const composer = style({
  display: 'flex',
  alignItems: 'flex-end',
  columnGap: theme.spacing[1],
  backgroundColor: theme.color.white,
  border: `${theme.border.width.standard}px solid ${theme.color.blue200}`,
  borderRadius: '24px',
  boxShadow: theme.shadows.subtle,
  paddingLeft: theme.spacing[3],
  paddingRight: theme.spacing[1],
  paddingTop: theme.spacing[2],
  paddingBottom: theme.spacing[1],
  transition: 'border-color 150ms ease, box-shadow 150ms ease',
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
  selectors: {
    '&:focus-within': {
      borderColor: theme.color.blue400,
      boxShadow: theme.shadows.small,
    },
  },
})

/** Fixed at four lines, and not draggable, so the box never changes size */
export const textarea = style({
  flexGrow: 1,
  minWidth: 0,
  margin: 0,
  padding: 0,
  height: `${LINE_HEIGHT * ROWS}px`,
  border: 'none',
  outline: 'none',
  resize: 'none',
  backgroundColor: 'transparent',
  color: theme.color.dark400,
  fontFamily: theme.typography.fontFamily,
  fontSize: 16,
  lineHeight: `${LINE_HEIGHT}px`,
  overflowY: 'auto',
  '::placeholder': {
    color: theme.color.dark300,
  },
  ':disabled': {
    color: theme.color.dark300,
  },
})

/** Keeps the send button in the bottom corner of the box */
export const submit = style({
  flexShrink: 0,
})
