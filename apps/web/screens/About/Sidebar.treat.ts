import { style, globalStyle } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const positionRef = style({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '318px',
})

export const container = style({
  width: '318px',
  zIndex: 1,
  borderRadius: '8px',
  transition: 'all .3s',
  overflow: 'hidden',
  background: theme.color.blue100,
})

export const gradient = style({
  position: 'absolute',
  zIndex: -1,
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  margin: '-10px',
  opacity: 0,
  background:
    'linear-gradient(120.27deg, #0161FD -0.52%, #3F46D2 29.07%, #812EA4 59.85%, #C21578 90.63%, #FD0050 117.86%)',
})

export const gradientVisible = style({
  opacity: 1,
})

globalStyle(`${container} *`, {
  transition: 'all .3s',
})

export const containerAbsolute = style({
  position: 'absolute',
  top: '0px',
  right: '0px',
})

export const containerFixed = style({
  position: 'fixed',
  top: '0px',
})
