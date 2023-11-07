import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'
import { hexToRgba } from '@island.is/island-ui/utils'

export const gallery = style({
  contain: 'layout',
  position: 'relative',
  zIndex: theme.zIndex.base,
})

export const galleryImageWrap = style({
  position: 'relative',
  height: '100%',
  width: '100%',

  ':before': {
    display: 'block',
  },
})

export const thumbnailGrid = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
})

export const galleryButton = style({
  border: '1px solid #d2d2d2',
  borderRadius: ' 8px',
  overflow: 'hidden',
  position: 'relative',
  display: 'block',
  zIndex: theme.zIndex.base,
  width: '100%',
  opacity: 0.8,

  ':focus': {
    borderColor: theme.color.mint400,
    outline: 0,
  },
})

export const activeGalleryButton = style({
  borderColor: theme.color.blue400,
  transition: theme.transitions.fast,
  opacity: 1,
})

export const lastImageOverlay = style({
  position: 'absolute',
  top: '0',
  left: '0',
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: hexToRgba(theme.color.blue100, 0.6),
})
