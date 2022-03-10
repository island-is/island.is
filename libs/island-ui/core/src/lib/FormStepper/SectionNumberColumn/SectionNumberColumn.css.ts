import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const root = style({
  width: 32,
  height: 32,
  flex: '0 0 32px',
})

export const rootSubSection = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      width: 16,
      height: 16,
      flex: '0 0 16px',
    },
  },
})
