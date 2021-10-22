import { keyframes, style, styleVariants } from '@vanilla-extract/css'
import { mapToStyleProperty } from '../../utils/mapToStyleProperty'
import { theme } from '@island.is/island-ui/theme'

export const colors = styleVariants(mapToStyleProperty(theme.color, 'fill'))

export const spin = style({
  lineHeight: 0,
  animationName: keyframes({
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(359deg)',
    },
  }),
  animationTimingFunction: 'linear',
  animationIterationCount: 'infinite',
  animationDuration: '1.5s',
})
