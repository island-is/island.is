import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const descriptionOffset = style({
  marginTop: '-24px',
})

export const confirmationIllustration = style({
  marginTop: theme.spacing[5],
  display: 'none',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      display: 'block',
    },
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'none',
    },
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      display: 'block',
    },
  },
})
