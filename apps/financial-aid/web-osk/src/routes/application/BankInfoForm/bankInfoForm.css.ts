import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const bankInformationContainer = style({
  display: 'block',
  alignItems: 'flex-start',
  columnGap: theme.spacing[3],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'grid',
      gridTemplateColumns: 'repeat(8, 1fr)',
    },
  },
})

export const bankNumber = style({
  gridColumn: 'span 3',
})

export const accountNumber = style({
  gridColumn: 'span 4',
})
