import { style } from 'treat'
import { ThemeOrAny } from 'treat/theme'
import { ThemedStyle, Style } from 'treat/lib/types/types'
import { theme } from '@island.is/island-ui/theme'

const whenMobile = (style: ThemedStyle<Style, ThemeOrAny>) => ({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md - 1}px)`]: {
      ...style,
    },
  },
})

export const link = style({
  ':hover': {
    textDecoration: 'none',
  },
})

export const removeMobileSpacing = style({
  ...whenMobile({
    paddingLeft: theme.grid.gutter.mobile / 2,
    paddingRight: theme.grid.gutter.mobile / 2,
  }),
})

export const tabWrapper = style({
  display: 'inline-flex',
})

export const tabContainer = style({
  outline: 0,
})

export const tabPanelWrapper = style({
  position: 'relative',
})

export const tabPanel = style({
  position: 'absolute',
  width: '100%',
  top: 0,
  left: 0,
  right: 0,
  opacity: 0,
  pointerEvents: 'none',
  transition: `opacity 300ms ease 0ms`,
})

export const tabPanelVisible = style({
  opacity: 1,
  outline: 0,
  position: 'relative',
  display: 'inline-block',
  width: '100%',
  pointerEvents: 'initial',
  transition: `opacity 600ms ease 300ms`,
})

export const textItem = style({
  position: 'relative',
  display: 'inline-block',
  transform: `translateX(-25%)`,
  transition: `all 600ms ease`,
})

export const textItemVisible = style({
  opacity: 1,
  transform: `translateY(0)`,
})

export const tabBullet = style({
  width: 8,
  height: 8,
  backgroundColor: theme.color.red200,
  borderRadius: 8,
  marginRight: 16,
  transition: `all 300ms ease`,
})

export const tabBulletSelected = style({
  width: 32,
  backgroundColor: theme.color.red400,
})

export const srOnly = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  border: '0',
})

export const dots = style({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
})

export const imageContainer = style({
  position: 'relative',
  display: 'flex',
  overflow: 'hidden',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
})

export const arrowButton = style({
  position: 'relative',
  display: 'flex',
  zIndex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50%',
  width: 40,
  height: 40,
  backgroundColor: theme.color.red100,
  opacity: 1,
  transition: 'all 150ms ease',
  outline: 0,
  ':focus': {
    backgroundColor: theme.color.red200,
  },
  ':hover': {
    backgroundColor: theme.color.red200,
  },
})

export const arrowButtonDisabled = style({
  opacity: 0.5,
})

export const searchContentContainer = style({
  ...whenMobile({
    borderRadius: 0,
  }),
})

export const animationContainer = style({
  opacity: 1,
  transform: `translateX(0)`,
  transition: `opacity 1000ms ease, transform 1000ms ease`,
})

export const animationContainerHidden = style({
  opacity: 0,
  transform: `translateX(25px)`,
})
