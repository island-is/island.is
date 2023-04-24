import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const menu = style({
  minWidth: 'fit-content',
})

export const menuItem = style({
  padding: `${theme.spacing[2]}px ${theme.spacing[3]}px`,
  maxWidth: '370px',
  width: 'max-content',
  '@media': {
    [`(max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '200px',
    },
  },
})

export const syncButton = style({
  textDecorationLine: 'underline',
})
