import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const rowLink = style({
  display: 'block',
  textDecoration: 'none',
})

export const titleText = style({
  fontSize: 14,
  lineHeight: '24px',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      fontSize: 18,
    },
  },
})
