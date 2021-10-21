import { style, styleMap } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const wrapper = style({
  display: 'inline-block',
  position: 'relative',
  width: '100%',
  ':after': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    pointerEvents: 'none',
    borderRadius: 6,
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: theme.color.mint400,
    opacity: 0,
  },
})

export const menuContainer = style({
  position: 'relative',
})

export const sizes = styleMap({
  medium: {},
  large: {},
})

export const focused = style({
  ':after': {
    opacity: 1,
  },
})

export const open = style({
  ':after': {
    borderBottomWidth: 0,
    borderRadius: '6px 6px 0 0',
  },
})

export const icon = style({
  position: 'absolute',
  lineHeight: 0,
  top: '50%',
  right: 26,
  transform: 'translateY(-50%)',
  outline: 0,
  '::before': {
    zIndex: -1,
    content: '""',
    borderRadius: 5,
    position: 'absolute',
    cursor: 'pointer',
    opacity: 0,
    backgroundColor: theme.color.white,
    borderColor: theme.color.blue200,
    borderStyle: 'solid',
    borderWidth: 1,
    transition: `opacity 150ms ease`,
  },
  selectors: {
    '&:focus::before': {
      borderColor: theme.color.blue400,
      borderWidth: 1,
      borderStyle: 'solid',
    },
  },
})

export const iconWhite = style({
  '::before': {
    backgroundColor: 'transparent',
  },
})

export const focusable = style({
  ':before': {
    opacity: 1,
  },
})

export const iconSizes = styleMap({
  medium: {
    right: 8,
    ':before': {
      left: -5,
      right: -5,
      top: -5,
      bottom: -5,
    },
    ...themeUtils.responsiveStyle({
      md: {
        right: 13,
      },
    }),
  },
  large: {
    right: 26,
    ':before': {
      left: -10,
      right: -10,
      top: -10,
      bottom: -10,
    },
  },
})

export const loadingIcon = style({
  position: 'absolute',
  lineHeight: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  outline: 0,
  '@keyframes': {
    from: {
      transform: 'translateY(-50%) rotate(0deg)',
    },
    to: {
      transform: 'translateY(-50%) rotate(360deg)',
    },
  },
  animationDuration: '1.5s',
  animationIterationCount: 'infinate',
  animationTimingFunction: 'linear',
})

export const loadingIconSizes = styleMap({
  medium: {
    right: 8,
    ...themeUtils.responsiveStyle({
      md: {
        right: 13,
      },
    }),
  },
  large: {
    right: 26,
  },
})

export const white = style({
  backgroundColor: theme.color.transparent,
  ':before': {
    backgroundColor: theme.color.transparent,
  },
  selectors: {
    '&:focus:before': {
      borderColor: theme.color.white,
      borderWidth: 2,
    },
  },
})
