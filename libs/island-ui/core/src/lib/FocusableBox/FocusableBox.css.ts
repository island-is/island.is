import { style, styleVariants } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const focusable = style({
  position: 'relative',
  transition: 'border-color 150ms ease',

  '::before': {
    content: "''",
    display: 'inline-block',
    position: 'absolute',
    zIndex: 1,
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

export const colorSchemes = styleVariants({
  purple: {
    '@media': {
      [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
        ':hover': {
          borderColor: theme.color.purple400,
        },
        ':focus': {
          borderColor: 'transparent',
        },
      },
    },
  },
  blue: {
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
  },
  red: {
    '@media': {
      [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
        ':hover': {
          borderColor: theme.color.red400,
        },
        ':focus': {
          borderColor: 'transparent',
        },
      },
    },
  },
  white: {
    '@media': {
      [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
        ':hover': {
          borderColor: theme.color.white,
        },
        ':focus': {
          borderColor: 'transparent',
        },
      },
    },
  },
  blueberry: {
    '@media': {
      [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
        ':hover': {
          borderColor: theme.color.blueberry600,
        },
        ':focus': {
          borderColor: 'transparent',
        },
      },
    },
  },
  dark: {
    '@media': {
      [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
        ':hover': {
          borderColor: theme.color.dark400,
        },
        ':focus': {
          borderColor: 'transparent',
        },
      },
    },
  },
})
