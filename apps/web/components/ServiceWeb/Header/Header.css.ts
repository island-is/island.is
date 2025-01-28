import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

export const logoTitleContainer = style({
  position: 'relative',
  paddingLeft: 32,
  marginLeft: 32,
  ':before': {
    content: '""',
    position: 'absolute',
    top: -12,
    left: 0,
    backgroundColor: theme.color.white,
    width: 1,
    height: 56,
    opacity: 0.5,
  },
})

export const headingLink = style({
  textDecoration: 'none',
  ':active': {
    textDecoration: 'none',
  },
  ':hover': {
    textDecoration: 'none',
  },
  selectors: {
    '&:hover:active': {
      textDecoration: 'none',
    },
  },
})

export const logoTitleContainerDark = style({
  ':before': {
    backgroundColor: theme.color.dark400,
  },
})

export const headerActions = style({
  height: 40,
  ...themeUtils.responsiveStyle({
    md: {
      height: 48,
    },
  }),
})

export const gridContainer = style({
  zIndex: 1,
})
