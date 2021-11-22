import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const iconContainer = style({
  maxHeight: '200px',
  alignSelf: 'center',
})

export const figure = style({
  maxHeight: '200px',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      display: 'None',
    },
  },
})
