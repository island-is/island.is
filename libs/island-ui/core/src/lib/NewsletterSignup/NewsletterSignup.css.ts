import { style, styleVariants } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const buttonWrap = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      marginLeft: 'auto',
    },
  },
})

export const inputWrap = style({
  flex: '0 1 70%',
})

export const variants = styleVariants({
  white: {
    backgroundColor: 'white',
  },
  blue: {
    backgroundColor: theme.color.blue100,
  },
})

export const successBox = style({
  maxWidth: 400,
})
