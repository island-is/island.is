import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const margin = style({
  position: 'relative',
  paddingLeft: '130px',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      paddingLeft: '90px',
    },
    [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
      paddingLeft: '0',
    },
  },
})

export const icon = style({
  position: 'absolute',
  top: 0,
  left: 0,

  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
      display: 'none',
    },
  },
})
