import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const thumbnail = style({
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  width: 137,
  height: 156,
  flex: 'none',
  display: 'none',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'block',
    },
  },
})

export const card = style({
  position: 'relative',
  ':focus': {
    outline: 0,
  },
  ':before': {
    content: "''",
    display: 'inline-block',
    position: 'absolute',
    pointerEvents: 'none',
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: theme.color.transparent,
    borderRadius: theme.border.radius.large,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    opacity: 0,
    transition: 'border-color 150ms ease, opacity 150ms ease',
  },
  selectors: {
    [`&:focus::before`]: {
      borderWidth: 3,
      borderStyle: 'solid',
      borderColor: theme.color.mint400,
      opacity: 1,
      outline: 0,
    },
    [`&:focus:hover`]: {
      borderColor: theme.color.white,
    },
  },
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      border: `1px solid ${theme.color.blue200}`,
      borderRadius: theme.border.radius.large,
      ':hover': {
        borderColor: theme.color.purple400,
      },
      ':focus': {
        borderColor: 'transparent',
      },
    },
  },
})

export const image = style({
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  width: '100%',
  flex: 'none',
  paddingBottom: '100%',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'none',
    },
  },
})

export const content = style({
  flex: 1
})
