import { theme, themeUtils } from '@island.is/island-ui/theme'
import { styleVariants } from '@vanilla-extract/css'
import { style, globalStyle } from '@vanilla-extract/css'

export const badge = styleVariants({
  active: {
    position: 'absolute',
    top: 34,
    left: 37,
    height: theme.spacing[1],
    width: theme.spacing[1],
    borderRadius: '50%',
    backgroundColor: theme.color.red400,
    ...themeUtils.responsiveStyle({
      md: {
        left: 47,
      },
    }),
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

export const svgOutline = style({})

globalStyle(`${svgOutline} svg path`, {
  stroke: theme.color.blue400,
})
