import { style, styleVariants } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'
import covidColors from '../colors'

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
  green: {
    '@media': {
      [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
        ':hover': {
          borderColor: covidColors.green400,
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
          borderColor: covidColors.blue400,
        },
        ':focus': {
          borderColor: 'transparent',
        },
      },
    },
  },
})
