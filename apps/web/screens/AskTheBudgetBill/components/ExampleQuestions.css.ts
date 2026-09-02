import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

/**
 * Shaped like the blue `Tag` the rest of the site uses, but a question is a
 * whole sentence rather than a label, so it wraps and is left aligned instead
 * of being held on a single line.
 */
export const question = style({
  display: 'inline-block',
  textAlign: 'left',
  maxWidth: '100%',
  border: 'none',
  outline: 0,
  cursor: 'pointer',
  padding: '6px 12px',
  borderRadius: theme.border.radius.large,
  backgroundColor: theme.color.blue100,
  color: theme.color.blue400,
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.semiBold,
  fontSize: 14,
  lineHeight: 1.5,
  transition: 'background-color 150ms ease, color 150ms ease',
  ':hover': {
    backgroundColor: theme.color.blue200,
  },
  ':focus-visible': {
    boxShadow: `0 0 0 3px ${theme.color.mint400}`,
  },
  selectors: {
    // Nothing to ask, so it does not answer the pointer either
    '&:disabled': {
      cursor: 'default',
    },
    '&:disabled:hover': {
      backgroundColor: theme.color.blue100,
    },
  },
  ...themeUtils.responsiveStyle({
    md: {
      fontSize: 16,
    },
  }),
})
