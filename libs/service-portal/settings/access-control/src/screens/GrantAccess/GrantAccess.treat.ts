import { style, styleMap } from 'treat'

import { theme, themeUtils } from '@island.is/island-ui/theme'

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
  animationIterationCount: 'infinite',
  animationTimingFunction: 'linear',
})
