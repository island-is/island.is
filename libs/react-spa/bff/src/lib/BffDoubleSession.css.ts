import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const buttonWrapper = style({
  marginTop: theme.spacing[2],
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'inline',
    },
  },
})
