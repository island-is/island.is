import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const root = style({
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
})

export const image = style({
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  paddingBottom: '55%',
})

export const content = style({})

export const readMore = style({
  marginTop: 'auto',
})
