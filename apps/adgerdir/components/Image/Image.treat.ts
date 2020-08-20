import { style } from 'treat'

export const container = style({
  position: 'relative',
})

export const image = style({
  height: 'auto',
  display: 'none',
  transition: 'opacity .5s',
  opacity: 0,
})

export const imageShow = style({
  display: 'block',
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
