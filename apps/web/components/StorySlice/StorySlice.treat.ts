import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const margin = style({
  position: 'relative',
  paddingLeft: '130px',

  '@media': {
    [`screen and min-width(${theme.breakpoints.sm}px)`]: {
      paddingLeft: '90px',
    },
  },
})

export const icon = style({
  position: 'absolute',
  top: 0,
  left: 0,
})
