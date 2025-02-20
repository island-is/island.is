import { globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const grid = style({
  padding: `calc(${theme.spacing[1]}px)`,
  ...themeUtils.responsiveStyle({
    md: {
      padding: theme.spacing[1] * 1.5,
      paddingLeft: 0,
      paddingRight: 0,
    },
  }),
})

export const innerGrid = style({
  padding: theme.spacing[1] * 1.5,
})

export const white = style({
  background: theme.color.white,
})

export const titleCol = style({
  paddingLeft: theme.spacing[2],
})

export const container = style({
  paddingLeft: theme.spacing[1],
})

export const backgroundColor = styleVariants({
  white: { background: theme.color.white },
  blue: { background: theme.color.blue100 },
})

export const noLeftPadding = style({
  paddingLeft: 0,
})

export const text = style({})

globalStyle(`${container} > p, ${text} > p`, {
  fontSize: '14px',
})

globalStyle(`${grid} > div`, {
  margin: 0,
})
