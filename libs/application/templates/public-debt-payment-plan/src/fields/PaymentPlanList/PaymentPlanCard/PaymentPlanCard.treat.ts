import { theme } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const titleIcon = style({
  display: 'inline-block',
  transform: 'translateY(3px)',
  marginRight: 8,
})

export const valueLine = style({
  marginLeft: 0,
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.lg}px)`]: {
      marginLeft: '2px',
    },
  },
})
