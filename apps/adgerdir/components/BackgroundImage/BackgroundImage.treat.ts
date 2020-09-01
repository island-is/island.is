import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  position: 'relative',
  display: 'inline-block',
  height: 'auto',
  width: '100%',
  overflow: 'hidden',
  backgroundColor: theme.color.dark100,
})

export const bgImage = style({
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
})

export const image = style({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  transition: 'opacity .5s',
  opacity: 0,
})

export const imageShow = style({
  opacity: 1,
})

export const thumbnail = style({
  background: 'no-repeat none center center',
  backgroundSize: 'cover',
  filter: 'blur(10px)',
  transition: 'opacity .5s',
  opacity: 1,
})

export const thumbnailHide = style({
  opacity: 0,
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
})
