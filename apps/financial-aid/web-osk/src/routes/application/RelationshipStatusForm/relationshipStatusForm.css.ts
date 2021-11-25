import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const infoContainer = style({
  overflow: 'hidden',
  maxHeight: 0,
  transition: 'max-height 250ms ease',
  marginBottom: theme.spacing[5],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      marginBottom: theme.spacing[10],
    },
  },
})

export const showInfoContainer = style({
  maxHeight: '350px',
})
