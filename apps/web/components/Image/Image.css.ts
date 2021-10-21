import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  position: 'relative',
  background: theme.color.dark100,
  overflow: 'hidden',
})

export const image = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: 0,
  transition: 'opacity .5s',
})

export const thumbnail = style({
  opacity: 1,
  filter: 'blur(20px)',
  transform: 'scale(1.05)',
})

export const show = style({
  opacity: 1,
})
