import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  alignItems: 'flex-start',
  columnGap: theme.spacing[3],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
})

export const fileContainer = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  alignItems: 'flex-start',
  columnGap: theme.spacing[3],
  marginBottom: theme.spacing[5],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      gridTemplateColumns: 'repeat(8, 1fr)',
    },
  },
})

export const files = style({
  gridColumn: '1/-1',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      gridColumn: '2/8',
    },
  },
})
