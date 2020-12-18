import { style, Style, styleMap } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const divider = style({
  margin: '0 10px',
})

export const wrapper = style({
  display: 'inline-flex',
  alignItems: 'center',
})

type ColorScheme = (text: string, hover: string) => Style

const colorScheme: ColorScheme = (text, hover) => ({
  color: text,
  outline: 'none',
  transition: 'background-color 150ms ease-in-out, color 150ms ease-in-out',
  ':hover': {
    color: hover,
  },
  ':active': {
    backgroundColor: theme.color.mint400,
    color: theme.color.dark400,
  },
  ':focus': {
    backgroundColor: theme.color.mint400,
    color: theme.color.dark400,
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
  // TODO: think about off brand colors??
})

export const bullet = style({
  height: 4,
  width: 4,
  borderRadius: '50%',
  display: 'inline-block',
  margin: '0 10px',
})

export const color = styleMap({
  blue400: { backgroundColor: theme.color.blue400 },
  white: { backgroundColor: theme.color.white },
  // TODO: think about off brand colors??
})
