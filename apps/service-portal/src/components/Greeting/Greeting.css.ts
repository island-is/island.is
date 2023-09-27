import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const greetingContainer = style({
  marginBottom: -theme.spacing[3],
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.lg}px)`]: {
      marginBottom: 0,
    },
  },
})

export const greetingTextBox = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: '100%',
})

export const greetingSvg = style({
  marginTop: -theme.spacing[2],
})
