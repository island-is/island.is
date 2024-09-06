import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const cardBox = style({
  minWidth: '287px',
  minHeight: '460px',
})

export const seperator = style({
  height: 16,
  border: '1px solid #ccdfff',
})

export const title = style({
  overflow: 'hidden',
  height: 100,
})

export const textContainer = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      height: 68,
      overflow: 'hidden',
    },
  },
})
