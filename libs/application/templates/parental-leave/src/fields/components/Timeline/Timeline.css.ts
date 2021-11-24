import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const scrollGradient = style({
  background:
    'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)',
  bottom: 0,
  pointerEvents: 'none',
  position: 'absolute',
  right: 0,
  top: 0,
  width: '60px',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      width: '100px',
    },
  },
})
