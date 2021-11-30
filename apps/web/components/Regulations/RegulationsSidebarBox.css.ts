import { style, styleVariants } from '@vanilla-extract/css'
import { DividerProps } from '@island.is/island-ui/core'
import { Colors, theme, spacing } from '@island.is/island-ui/theme'

const { color, typography, border } = theme

export type ColorScheme = 'purple' | 'blueberry' | 'blue' | 'dark'
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
  dark: {
    color: 'dark400',
    dividerColor: 'alternate',
    backgroundColor: 'dark100',
    linkColor: color.blue600,
    linkColorHover: color.blue400,
  },
}

export const smallText = style({
  fontSize: 14,
})

const linkStyles = {
  color: 'var(--RegSidebarBox-linkColor)',
  marginBottom: spacing[2],
  display: 'block',

  ':hover': {
    color: 'var(--RegSidebarBox-linkColorHover)',
    textDecoration: 'none',
  },
}

export const sidebarNonLink = style({
  marginBottom: spacing[2],
  display: 'block',
  // color: color.dark400,
  opacity: 0.67,
})
export const sidebarLink = style(linkStyles)
export const sidebarLinkCurrent = style({})

export const changelogCurrent = style({
  paddingLeft: 10,
  borderLeft: '1px solid ' + color.blueberry300,
})

export const timelineCurrent = changelogCurrent

export const timelineCurrentVersion = style({
  paddingTop: spacing[1],
  paddingBottom: spacing[1],
})

export const showAllChanges = style({
  ...linkStyles,
  fontSize: 14,
})
