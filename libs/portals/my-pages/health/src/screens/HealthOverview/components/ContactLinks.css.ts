import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const titleText = style({
  fontSize: 14,
  lineHeight: '24px',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      fontSize: 16,
    },
  },
})

export const descriptionText = style({
  fontSize: 14,
  lineHeight: '24px',
})

