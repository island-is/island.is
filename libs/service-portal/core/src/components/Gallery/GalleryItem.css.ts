import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const galleryItem = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
})

export const galleryItemHero = style({
  ':before': {
    position: 'absolute',
    inset: 0,
    content: '',
    zIndex: theme.zIndex.above,
  },
})

export const itemImage = style({
  position: 'absolute',
  inset: 0,
  zIndex: theme.zIndex.base,
  margin: 'auto',
  display: 'none',
  width: '100%',
  height: '100%',
  maxWidth: 'none',
  objectFit: 'cover',
})

export const activeImage = style({
  display: 'inherit',
})
