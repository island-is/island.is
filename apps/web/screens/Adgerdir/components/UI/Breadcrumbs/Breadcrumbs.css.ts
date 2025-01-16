import { style, styleVariants } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'
import covidColors from '../colors'

const colorScheme = (text: string, hover: string) => ({
  display: 'inline-flex',
  color: text,
  outline: 'none',
  transition: 'color 150ms ease-in-out',
  ':hover': {
    color: hover,
  },
})

const focusColors = (text: string) => ({
  outline: 'none',
  transition: 'background-color 150ms ease-in-out',
  ':active': {
    backgroundColor: theme.color.mint400,
    color: theme.color.dark400,
  },
  ':focus': {
    backgroundColor: theme.color.mint400,
    color: theme.color.dark400,
    textDecoration: 'none',
  },
  selectors: {
    '&:focus:active': {
      color: text,
    },
  },
})

export const breadcrumb = styleVariants({
  blue400: colorScheme(covidColors.green400, covidColors.green400),
  white: colorScheme(theme.color.white, theme.color.white),
})

export const focusable = styleVariants({
  blue400: focusColors(covidColors.green400),
  white: focusColors(theme.color.white),
})

export const isTag = style({
  ':hover': {
    textDecoration: 'none',
  },
})

export const bullet = style({
  height: 4,
  width: 4,
})

export const color = styleVariants({
  blue400: { backgroundColor: covidColors.green400 },
  white: { backgroundColor: theme.color.white },
})
