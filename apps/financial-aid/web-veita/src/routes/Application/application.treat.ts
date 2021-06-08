import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const applicantWrapper = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(8, 1fr)',
  columnGap: theme.spacing[3],
  width: '100%',
})

export const widthFull = style({
  gridColumn: '1/-1',
})

export const widtAlmostFull = style({
  gridColumn: '1/-1',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.xl}px)`]: {
      gridColumn: 'span 7',
    },
  },
})
