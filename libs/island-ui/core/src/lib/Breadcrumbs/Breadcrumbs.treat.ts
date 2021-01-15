import { style, styleMap } from 'treat'
import { theme } from '@island.is/island-ui/theme'

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

export const breadcrumb = styleMap({
  blue400: colorScheme(theme.color.blue400, theme.color.blueberry400),
  white: colorScheme(theme.color.white, theme.color.white),
})

export const focusable = styleMap({
  blue400: focusColors(theme.color.dark400),
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

export const color = styleMap({
  blue400: { backgroundColor: theme.color.blue400 },
  white: { backgroundColor: theme.color.white },
})
