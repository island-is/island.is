import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const gridWrapper = style({
  paddingLeft: theme.spacing[3],
  paddingRight: theme.spacing[3],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      columnGap: theme.spacing[3],
      paddingLeft: theme.spacing[6],
      paddingRight: theme.spacing[6],
    },
  },
})

export const childContainer = style({
  gridColumn: '4/-1',
  minHeight: `calc(100vh - ${theme.spacing[3]}px)`,
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  flexDirection: 'column',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridColumn: '5/-1',
    },
  },
})
