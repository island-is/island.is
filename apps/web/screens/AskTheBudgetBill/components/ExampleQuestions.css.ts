import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

/**
 * A question reads as a link rather than as a button, so it is a plain button
 * carrying the styling the rest of the site gives a link: blue, underlined once
 * it is pointed at. It stays a button because picking one asks the question
 * rather than taking the visitor anywhere.
 */
export const question = style({
  display: 'inline',
  margin: 0,
  padding: 0,
  border: 'none',
  background: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  color: theme.color.blue400,
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.regular,
  fontSize: 16,
  lineHeight: 1.5,
  ':hover': {
    color: theme.color.blueberry400,
    textDecoration: 'underline',
  },
  ':focus': {
    outline: 'none',
  },
  selectors: {
    '&:focus-visible': {
      boxShadow: `0 0 0 3px ${theme.color.mint400}`,
    },
    '&:disabled': {
      color: theme.color.dark300,
      cursor: 'default',
    },
    // Closed off, so it does not answer the pointer either
    '&:disabled:hover': {
      color: theme.color.dark300,
      textDecoration: 'none',
    },
  },
})
