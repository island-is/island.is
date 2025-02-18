import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const leftCol = style({
  flex: '0 0 90px',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
      alignItems: 'center',
      flex: 'auto',
    },
  },
})

export const expandButton = style({
  transition: 'transform .3s',
})

export const tilted = style({
  transform: 'rotate(45deg)',
})

export const textBody = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
      textAlign: 'center',
    },
  },
})
