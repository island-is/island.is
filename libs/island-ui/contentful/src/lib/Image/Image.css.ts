import { style } from '@vanilla-extract/css'

export const imageContainer = style({
  width: '100%',
  height: 'auto',
  overflow: 'hidden',
  backgroundColor: 'transparent',
  position: 'relative',
  aspectRatio: 'var(--aspect-ratio)',
})

export const image = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  opacity: 0,
  filter: 'blur(10px)',
  transition: 'opacity 0.5s ease-in-out, filter 0.5s ease-in-out',
})

export const loading = style({
  opacity: 1,
  filter: 'blur(10px)',
})

export const loaded = style({
  opacity: 1,
  filter: 'blur(0)',
})
