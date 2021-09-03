import { style, styleMap } from 'treat'

import { theme, themeUtils } from '@island.is/island-ui/theme'

export const hidden = style({
  visibility: 'hidden',
  height: 0,
})

export const inputWrapper = style({
  display: 'inline-block',
  position: 'relative',
  width: '100%',
})

export const icon = style({
  position: 'absolute',
  lineHeight: 0,
  top: '50%',
  right: 26,
  transform: 'translateY(-50%)',
  outline: 0,
  '::before': {
    left: -10,
    right: -10,
    top: -10,
    bottom: -10,
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

export const loadingIcon = style({
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
