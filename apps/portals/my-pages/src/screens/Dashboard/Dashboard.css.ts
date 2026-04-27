import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style, styleVariants, globalStyle } from '@vanilla-extract/css'

export const badge = styleVariants({
  active: {
    position: 'absolute',
    top: 34,
    left: 67,
    height: theme.spacing[1],
    width: theme.spacing[1],
    borderRadius: '50%',
    backgroundColor: theme.color.red400,
  },
  inactive: {
    display: 'none',
  },
})

export const lock = style({
  position: 'absolute',
  zIndex: 1,
  top: theme.spacing[2],
  right: theme.spacing[3],
})

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

export const featuredCardImage = style({
  height: 110,
  width: 'auto',
  display: 'block',
})

export const featuredCardNoText = style({})

globalStyle(`${featuredCardNoText} p`, {
  display: 'none',
})
