import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const radioButtonContainer = style({
  marginBottom: theme.spacing[3],
  backgroundColor: theme.color.blue100,
})

export const container = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  alignItems: 'flex-start',
  columnGap: theme.spacing[3],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.xl}px)`]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
})
