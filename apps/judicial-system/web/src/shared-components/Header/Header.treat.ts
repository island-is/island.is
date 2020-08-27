import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 80,
  padding: '0 16px',
  boxShadow: '0px 4px 26px rgba(0, 0, 0, 0.05)',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      padding: '0 48px',
    },
  },
})
