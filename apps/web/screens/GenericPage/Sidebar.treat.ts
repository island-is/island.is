import { style, globalStyle } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const parent = style({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '318px',
  display: 'none',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      display: 'block',
    },
  },
})

export const container = style({
  width: '318px',
  zIndex: 1,
  borderRadius: '8px',
  transition: 'all 150ms',
})

globalStyle(`${container} *:not(b)`, {
  transition: 'all 150ms',
})

export const background = style({
  borderRadius: '8px',
  position: 'absolute',
  zIndex: -1,
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  opacity: 0,
  background: theme.color.blue100,
})

export const visible = style({
  opacity: 1,
})

export const gradient = style({
  background:
    'linear-gradient(125.33deg, #0161FD -55.28%, #3F46D2 5.16%, #812EA4 68.02%, #C21578 130.88%, #FD0050 186.49%)',
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
