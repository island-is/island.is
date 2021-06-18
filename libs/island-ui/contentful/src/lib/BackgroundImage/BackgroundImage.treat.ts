import { style } from 'treat'

export const container = style({
  position: 'relative',
  display: 'inline-block',
  height: '100%',
  width: '100%',
  overflow: 'hidden',
})

export const bgImage = style({
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
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
  bottom: 0,
  filter: 'blur(10px)',
  left: 0,
  opacity: 1,
  position: 'absolute',
  right: 0,
  top: 0,
  transition: 'opacity .5s',
})

export const thumbnailHide = style({
  opacity: 0,
})
