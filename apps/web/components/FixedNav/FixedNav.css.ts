import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'
import { STICKY_NAV_HEIGHT } from '@island.is/web/constants'

export const wrapper = style({
  position: 'fixed',
  display: 'flex',
  width: '100%',
  left: 0,
  right: 0,
  top: 0,
  margin: 0,
  padding: 0,
  height: STICKY_NAV_HEIGHT,
  zIndex: 1000,
  backgroundColor: theme.color.blue400,
  transform: `translateY(-100%)`,
  opacity: 0,
  visibility: 'hidden',
  transition:
    'opacity 150ms ease, transform 150ms ease, visibility 0ms linear 150ms',
})

export const container = style({
  margin: '0 auto',
  padding: 0,
})

export const show = style({
  transform: `translateY(0%)`,
  opacity: 1,
  visibility: 'visible',
  transition:
    'opacity 150ms ease, transform 150ms ease, visibility 0ms linear 0ms',
})

export const arrowButton = style({
  display: 'flex',
  height: 40,
  width: 40,
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: theme.typography.semiBold,
  borderRadius: 8,
  outline: 'none',
  cursor: 'pointer',
  transition: 'box-shadow .25s, color .25s, background-color .25s',
  backgroundColor: theme.color.transparent,
  boxShadow: `inset 0 0 0 1px ${theme.color.white}`,
  color: theme.color.white,
  ':active': {
    boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
  },
  ':focus': {
    color: theme.color.dark400,
    backgroundColor: theme.color.mint400,
    boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
  },
  ':hover': {
    backgroundColor: theme.color.transparent,
    boxShadow: `inset 0 0 0 2px ${theme.color.dark100}`,
    color: theme.color.dark100,
  },
  selectors: {
    '&:focus:active': {
      backgroundColor: theme.color.transparent,
      boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
    },
  },
  ...themeUtils.responsiveStyle({
    md: {
      height: 48,
      width: 48,
    },
  }),
})

export const logo = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})
