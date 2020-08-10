import { style, globalStyle } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  width: '100%',
  display: 'none',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      display: 'block',
    },
  },
})

export const sticky = style({
  position: 'sticky',
  top: '0px',
  borderRadius: '8px',
})

export const stickyInner = style({
  position: 'relative',
})

export const background = style({
  borderRadius: '8px',
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  opacity: 0,
  transition: 'opacity 150ms',
  background: theme.color.blue100,
})

export const gradient = style({
  background:
    'linear-gradient(125.33deg, #0161FD -55.28%, #3F46D2 5.16%, #812EA4 68.02%, #C21578 130.88%, #FD0050 186.49%)',
})

export const visible = style({
  opacity: 1,
})
