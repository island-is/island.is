import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const content = style({
  position: 'relative',
})

export const backgroundGradient = style({
  background:
    'linear-gradient(120.27deg, #0161FD -0.52%, #3F46D2 29.07%, #812EA4 59.85%, #C21578 90.63%, #FD0050 117.86%)',
})

export const offsetRight = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      paddingRight: '342px',
    },
  },
})

export const center = style({
  marginLeft: 'auto',
  marginRight: 'auto',
})

export const col6 = style({
  maxWidth: '660px',
})

export const col7 = style({
  maxWidth: '776px',
})

export const col8 = style({
  maxWidth: '890px',
})
