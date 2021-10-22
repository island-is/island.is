import { style, StyleRule } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

const whenMobile = (style: StyleRule) => ({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md - 1}px)`]: {
      ...style,
    },
  },
})

export const tabWrapper = style({
  display: 'inline-flex',
})

export const tabContainer = style({
  outline: 0,
})

export const tabPanelWrapper = style({
  position: 'relative',
  minHeight: 300,

  ...themeUtils.responsiveStyle({
    lg: {
      minHeight: 350,
    },
  }),
})

export const tabPanelRow = style({
  position: 'relative',
})

export const tabPanel = style({
  opacity: 0,
  pointerEvents: 'none',
  display: 'flex',
  position: 'absolute',
})

export const tabPanelVisible = style({
  position: 'relative',
  opacity: 1,
  outline: 0,
  pointerEvents: 'initial',
})

export const textItem = style({
  position: 'relative',
  display: 'inline-block',
  opacity: 0,
  transition: `opacity 1000ms, transform 800ms`,
  transform: 'translateX(-20px)',
})

export const textItemVisible = style({
  opacity: 1,
  transform: 'translateX(0)',
})

export const tabBullet = style({
  display: 'inline-block',
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

export const dots = style({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
})

export const imageContainer = style({
  position: 'relative',
  display: 'inline-block',
  overflow: 'hidden',
  height: '100%',
  width: '100%',
})

export const searchContentContainer = style({
  borderRadius: theme.border.radius.large,
  ...whenMobile({
    borderRadius: 0,
    marginLeft: -24,
    marginRight: -24,
    width: `calc(100% + ${24 * 2}px)`,
  }),
})

export const tabListArrowLeft = style({
  position: 'absolute',
  top: 0,
  left: 12,
})

export const tabListArrowRight = style({
  position: 'absolute',
  top: 0,
  right: 12,
  zIndex: 1,
})
