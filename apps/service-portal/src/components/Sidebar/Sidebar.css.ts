import { style, styleVariants } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

const sidebarBase = style({
  position: 'absolute',
  top: 0,
  zIndex: 10,
  height: '100%',
  marginBottom: theme.spacing['10'],
  ...themeUtils.responsiveStyle({
    lg: {
      width: 252,
    },
  }),
})

export const sidebar = styleVariants({
  open: [
    sidebarBase,
    {
      background: `${theme.color.blue100}`,
      minWidth: '252px',
    },
  ],
  closed: [
    sidebarBase,
    {
      background: `${theme.color.transparent}`,
      maxWidth: '144px',
      minWidth: '144px',
    },
  ],
})

export const subnav = style({
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
