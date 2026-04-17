import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const input = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      minWidth: 250,
    },
  },
})

globalStyle(`${input} > div > div:first-child`, {
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      minHeight: 48,
      alignItems: 'center',
    },
  },
})
