import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  position: 'fixed',
  left: 0,
  right: 0,
  top: 0,
  zIndex: 1000,
  backgroundColor: theme.color.blue400,
  transform: `translateY(-100%)`,
  opacity: 0,
  visibility: 'hidden',
  transition:
    'opacity 150ms ease, transform 150ms ease, visibility 0ms linear 150ms',
})

export const show = style({
  transform: `translateY(0%)`,
  opacity: 1,
  visibility: 'visible',
  transition:
    'opacity 150ms ease, transform 150ms ease, visibility 0ms linear 0ms',
})
