import { style, styleVariants } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const sidebar = style({
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 10,
  height: '100%',
  marginBottom: theme.spacing['10'],
  transition: 'all 150ms ease-in-out',
  width: 252,
  ...themeUtils.responsiveStyle({
    lg: {},
  }),
})

export const collapsed = style({
  left: '-108px',
})

export const subnav = style({
  width: 228,
  transition: 'all 150ms ease-in-out',
  marginLeft: 12,
  paddingLeft: 26,
  borderLeft: `1px solid ${theme.color.blue200}`,
})

export const navIcon = style({
  position: 'absolute',
  right: '-28px',
  top: '34px',
  ':hover': {
    cursor: 'pointer',
  },
})
