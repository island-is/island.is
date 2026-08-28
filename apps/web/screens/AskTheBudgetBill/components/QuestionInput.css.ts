import { globalStyle, style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

const BUTTON_SIZE = 32
/** Leaves the button room, so a long question does not run underneath it */
const BUTTON_GUTTER = 16

export const wrapper = style({
  position: 'relative',
  width: '100%',
  borderRadius: theme.border.radius.large,
  // The mint ring the design system draws around a focused search box
  ':after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    borderRadius: theme.border.radius.large,
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: theme.color.mint400,
    opacity: 0,
  },
  selectors: {
    '&:focus-within::after': {
      opacity: 1,
    },
  },
})

export const input = style({
  appearance: 'none',
  width: '100%',
  height: 56,
  borderRadius: theme.border.radius.large,
  background: theme.color.white,
  borderColor: theme.color.blue200,
  borderWidth: 1,
  borderStyle: 'solid',
  outline: 0,
  color: theme.color.dark400,
  caretColor: theme.color.blue400,
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.light,
  fontSize: 16,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  padding: `0 ${BUTTON_SIZE + BUTTON_GUTTER * 2}px 0 ${BUTTON_GUTTER}px`,
  transition: 'border-color 150ms ease',
  '::placeholder': {
    color: theme.color.dark300,
  },
  ':hover': {
    borderColor: theme.color.blue400,
  },
  ...themeUtils.responsiveStyle({
    md: {
      height: 64,
      fontSize: 18,
    },
  }),
})

export const button = style({
  position: 'absolute',
  top: '50%',
  right: BUTTON_GUTTER,
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: BUTTON_SIZE,
  height: BUTTON_SIZE,
  padding: 0,
  border: 'none',
  borderRadius: theme.border.radius.full,
  backgroundColor: theme.color.blue400,
  color: theme.color.white,
  cursor: 'pointer',
  opacity: 1,
  transition: 'opacity 150ms ease',
  ':hover': {
    backgroundColor: theme.color.blueberry400,
  },
  selectors: {
    '&:disabled': {
      cursor: 'default',
    },
    // Nothing to send yet, so it does not answer the pointer either
    '&:disabled:hover': {
      backgroundColor: theme.color.blue400,
    },
  },
})

/** Empty box: the button is there, faded, waiting for a question */
export const buttonInactive = style({
  opacity: 0.4,
})

export const arrow = style({})

// The arrow is stroked on a 512 unit viewBox, where the 32 the icon is drawn
// with comes out as a hairline once it is scaled down to 16px.
globalStyle(`${arrow} path`, {
  strokeWidth: 56,
})
