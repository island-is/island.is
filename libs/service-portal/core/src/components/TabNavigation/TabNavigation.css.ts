import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const select = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md + 1}px)`]: {
      height: 0,
      overflow: 'hidden',
    },
  },
})

export const description = style({})

globalStyle(`${description} > div:not(:first-child)`, {
  marginTop: `${theme.spacing[4]}px`,
})
