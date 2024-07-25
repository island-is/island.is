import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  overflow: 'scroll',
  minHeight: '150px',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      minHeight: '460px',
    },
  },
})

export const image = style({
  width: '100%',
  height: '100%',
  objectFit: 'fill',
  maxHeight: '230px',
  minHeight: '100px',
  minWidth: '85px',
})
