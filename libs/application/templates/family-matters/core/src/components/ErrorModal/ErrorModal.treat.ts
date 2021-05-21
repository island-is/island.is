import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const dialog = style({
  margin: '0 auto',
  padding: '0 24px',
  maxWidth: 888,
  position: 'relative',
  filter: `drop-shadow(0 4px 70px rgba(0, 97, 255, 0.1))`,
  top: '25%',

  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
      top: '15%',
    },
  },
})
