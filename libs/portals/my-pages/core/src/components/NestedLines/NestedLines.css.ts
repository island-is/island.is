import { globalStyle, style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const grid = style({
  padding: `calc(${theme.spacing[1]}px / 2)`,
  ...themeUtils.responsiveStyle({
    md: {
      padding: `0 ${theme.spacing[1]}px`,
    },
  }),
})

export const innerGrid = style({
  padding: `calc(${theme.spacing[1]}px)`,
  ...themeUtils.responsiveStyle({
    md: {
      padding: theme.spacing[1] * 1.5,
      paddingLeft: 0,
      paddingRight: 0,
    },
  }),
})

export const white = style({
  background: theme.color.white,
})

export const titleCol = style({
  paddingLeft: theme.spacing[1],
  fontSize: '14px',
  ...themeUtils.responsiveStyle({
    md: {
      paddingLeft: theme.spacing[2],
    },
  }),
})

export const valueCol = style({
  paddingLeft: theme.spacing[1],
  fontSize: '14px',
  ...themeUtils.responsiveStyle({
    md: {
      paddingLeft: theme.spacing[0],
    },
  }),
})

export const noPadding = style({
  padding: 0,
})

globalStyle(`${valueCol} > span`, {
  fontSize: '14px',
})

globalStyle(`${titleCol} > span`, {
  fontSize: '14px',
})
