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
  background: theme.color.blue100,
})

export const gradient = style({
  borderRadius: '8px',
  position: 'absolute',
  zIndex: -1,
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  opacity: 0,
  background:
    'linear-gradient(125.33deg, #0161FD -55.28%, #3F46D2 5.16%, #812EA4 68.02%, #C21578 130.88%, #FD0050 186.49%)'
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
