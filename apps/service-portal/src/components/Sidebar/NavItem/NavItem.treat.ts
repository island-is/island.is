import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const dot = style({
  left: -35,
  width: theme.spacing['1'],
  height: theme.spacing['1'],
  opacity: 0,
  transition: 'opacity 250ms',
})

export const dotActive = style({
  opacity: 1,
})
