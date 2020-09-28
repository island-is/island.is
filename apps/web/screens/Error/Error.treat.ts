import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  paddingTop: '20vw',
  paddingBottom: '20vw',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      paddingTop: '236px',
      paddingBottom: '310px',
    },
  },
})
