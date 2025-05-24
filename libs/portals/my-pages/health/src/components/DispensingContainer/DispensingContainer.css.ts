import { theme, themeUtils } from '@island.is/island-ui/theme'
import { globalStyle, style, styleVariants } from '@vanilla-extract/css'

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

export const tagPadding = style({
  padding: theme.spacing[1],
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

export const closeButton = style({
  position: 'absolute',
  top: theme.spacing['1'],
  right: theme.spacing['1'],
  zIndex: 2,
})

export const modal = style({
  position: 'relative',
  maxWidth: `calc(100% - ${theme.spacing['6']}px)`,
  maxHeight: `calc(100% - ${theme.spacing['6']}px)`,
  margin: theme.spacing['3'],
  borderRadius: theme.border.radius.large,
  boxShadow: '0px 4px 70px rgba(0, 97, 255, 0.1)',
  backgroundColor: theme.color.white,
  ...themeUtils.responsiveStyle({
    md: {
      margin: `${theme.spacing['6']}px auto`,
      maxHeight: `calc(100% - ${theme.spacing['12']}px)`,
      width: '90%',
    },
    lg: {
      width: 880,
    },
  }),
})

export const blue = style({
  background: theme.color.blue100,
})

export const data = style({})

globalStyle(`${data} > p`, {
  textOverflow: 'ellipsis',
})

globalStyle(`${container} > p, ${text} > p`, {
  fontSize: '14px',
})

globalStyle(`${grid} > div`, {
  margin: 0,
})
