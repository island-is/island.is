import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

export const content = style({
  width: '100%',
  maxWidth: '1120px',
  marginLeft: 'auto',
  marginRight: 'auto',
})

/** Question box on the left, previous conversations on the right from lg up */
export const columns = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing[5],
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateColumns: 'minmax(0, 1fr) 320px',
      gap: theme.spacing[8],
      alignItems: 'start',
    },
  }),
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
