import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const gridWrapper = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
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
export const logo = style({
  paddingTop: theme.spacing[4],
  gridColumn: 'span 2',
})

export const logoHfjContainer = style({
  paddingTop: theme.spacing[4],
  gridColumn: '3/-1',
})

export const loginContainer = style({
  marginTop: theme.spacing[20],
  marginBottom: theme.spacing[20],
  gridColumn: '1/-1',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      gridColumn: '3 / span 8',
    },
    [`screen and (min-width: ${theme.breakpoints.xl}px)`]: {
      gridColumn: '3 / span 6',
    },
  },
})
