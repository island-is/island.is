import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const inputContainer = style({
  maxHeight: '0',
  overflow: 'hidden',
  transition: 'max-height 300ms ease',
})

export const inputAppear = style({
  maxHeight: '300px',
})

export const formAppear = style({
  maxHeight: '400px',
})

export const summaryBlockChild = style({
  minWidth: '50%',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      minWidth: '83%',
    },
  },
})
