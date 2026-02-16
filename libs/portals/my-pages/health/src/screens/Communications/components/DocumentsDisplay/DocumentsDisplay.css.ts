import { theme, themeUtils } from '@island.is/island-ui/theme'
import { styleVariants } from '@vanilla-extract/css'
import { style, globalStyle } from '@vanilla-extract/css'

export const mailIcon = style({
  minWidth: 30,
  width: 40,
  height: 40,
  ...themeUtils.responsiveStyle({
    md: {
      minWidth: 40,
    },
  }),
})

export const mailLink = style({
  display: 'inline-block',
})

export const svgOutline = style({})

globalStyle(`${svgOutline} svg path`, {
  stroke: theme.color.blue400,
})

export const badge = styleVariants({
  active: {
    position: 'absolute',
    top: 34,
    left: 67,
    height: theme.spacing[1],
    width: theme.spacing[1],
    borderRadius: '50%',
    backgroundColor: theme.color.red400,
    ...themeUtils.responsiveStyle({
      md: {
        left: 67,
      },
    }),
  },
  inactive: {
    display: 'none',
  },
})
