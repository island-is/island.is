import { style, styleMap } from 'treat'
import { mapToStyleProperty } from '../../utils/mapToStyleProperty'
import { theme } from '@island.is/island-ui/theme'

export const colors = styleMap(mapToStyleProperty(theme.color, 'fill'))

export const spin = style({
  lineHeight: 0,
  '@keyframes': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(359deg)',
    },
  },
  animationTimingFunction: 'linear',
  animationIterationCount: 'infinite',
  animationDuration: '1.5s',
})
