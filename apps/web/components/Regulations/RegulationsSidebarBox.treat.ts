import { style, styleMap } from 'treat'
import { DividerProps } from '@island.is/island-ui/core'
import { Colors, theme } from '@island.is/island-ui/theme'

const { color, typography, border } = theme

export type ColorScheme = 'purple' | 'blueberry' | 'blue'
type ColorValue = typeof color[keyof typeof color]

type ColorValues = {
  color: Colors
  backgroundColor: Colors
  dividerColor: DividerProps['weight']
  linkColor: ColorValue
  linkColorHover: ColorValue
}

export const colors: Record<ColorScheme, ColorValues> = {
  purple: {
    color: 'dark400',
    dividerColor: 'alternate',
    backgroundColor: 'purple100',
    linkColor: color.purple600,
    linkColorHover: color.purple400,
  },
  blueberry: {
    color: 'blueberry600',
    dividerColor: 'blueberry200',
    backgroundColor: 'blueberry100',
    linkColor: color.blueberry600,
    linkColorHover: color.blueberry400,
  },
  blue: {
    color: 'blue600',
    dividerColor: 'regular',
    backgroundColor: 'blue100',
    linkColor: color.blue600,
    linkColorHover: color.blue400,
  },
}

export const smallText = style({
  fontSize: 14,
})
export const sidebarLink = style({
  color: 'var(--RegSidebarBox-linkColor)',
  ':hover': {
    color: 'var(--RegSidebarBox-linkColorHover)',
    textDecoration: 'none',
  },
})
export const sidebarLinkCurrent = style({})

export const timelineCurrent = style({
  paddingLeft: 10,
  borderLeft: '1px solid ' + color.blueberry300,
})
