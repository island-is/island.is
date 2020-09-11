import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const focusable = style({
  position: 'relative',
  transition: 'border-color 150ms ease',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      cursor: 'pointer',
      ':hover': {
        borderColor: theme.color.blue400,
      },
      selectors: {
        [`&:focus:hover`]: {
          borderColor: theme.color.white,
        },
      },
    },
  },

  '::before': {
    content: "''",
    display: 'inline-block',
    position: 'absolute',
    pointerEvents: 'none',
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: theme.color.transparent,
    borderRadius: 'inherit',
    top: -3,
    left: -3,
    bottom: -3,
    right: -3,
    opacity: 0,
    transition: 'border-color 150ms ease, opacity 150ms ease',
  },

  ':focus': {
    borderColor: 'transparent',
    outline: 0,
  },

  selectors: {
    [`&:focus::before`]: {
      borderWidth: 3,
      borderStyle: 'solid',
      borderColor: theme.color.mint400,
      opacity: 1,
      outline: 0,
    },
  },
})

export const focused = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      ':hover': {
        borderColor: theme.color.blue400,
      },
      ':focus': {
        borderColor: 'transparent',
      },
    },
  },
})
