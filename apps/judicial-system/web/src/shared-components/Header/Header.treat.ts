import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 80,
  padding: '0 16px',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      padding: '0 32px',
    },
  },
})
