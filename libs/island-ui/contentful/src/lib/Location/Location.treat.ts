import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  marginTop: -30,
})

export const background = style({
  height: 448,
  backgroundSize: 'auto 100%',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundColor: '#B5B9BF',
  marginTop: 334,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      marginTop: 60,
    },
  },
})

export const content = style({
  transform: 'translateY(calc(-100% + 60px))',
  margin: 'auto',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      transform: 'translateY(-50px)',
    },
  },
})

export const image = style({
  background:
    'linear-gradient(134.91deg, #0161FD 3.57%, #3F46D2 26.83%, #812EA4 51.01%, #C21578 75.19%, #FD0050 96.58%)',
  height: 220,
})
