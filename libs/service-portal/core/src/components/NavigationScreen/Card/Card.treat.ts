import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const card = style({
  transition: 'border-color 200ms',
  ':hover': {
    borderColor: theme.color.blue300,
  },
})

export const disabled = style({
  filter: 'blur(6px)',
  opacity: 0.5,
  pointerEvents: 'none',
})

export const tag = style({
  top: theme.spacing['1'],
  right: theme.spacing['1'],
})
