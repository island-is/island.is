import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'
import { hexToRgba } from '@island.is/island-ui/utils'

export const thumbnailGrid = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
})

export const container = style({
  position: 'relative',
  border: '1px solid #d2d2d2',
  borderRadius: ' 8px',
  overflow: 'hidden',
  transition: 'border .2s',
})

export const selectedImageOverlay = style({
  borderColor: theme.color.blue400,
})

export const image = style({
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  objectFit: 'contain',
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

export const thumbnail = style({
  opacity: 1,
  filter: 'blur(20px)',
  transform: 'scale(1.05)',
})

export const show = style({
  opacity: 1,
})

export const hide = style({
  opacity: 0,
})
