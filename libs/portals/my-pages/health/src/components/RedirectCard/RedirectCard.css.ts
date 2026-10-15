import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const buttonWrap = style({})

globalStyle(`${buttonWrap} a > span`, {
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md - 1}px)`]: {
      minHeight: 48,
    },
  },
})
