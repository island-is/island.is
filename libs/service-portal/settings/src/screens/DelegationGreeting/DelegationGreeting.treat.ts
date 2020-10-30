import { theme } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const cardBlurWrapper = style({
  filter: 'blur(6px)',
  opacity: 0.5,
  pointerEvents: 'none',
})

export const wipTag = style({
  top: theme.spacing['1'],
  right: theme.spacing['1'],
})
