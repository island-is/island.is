import { theme } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const head = style({
  display: 'none',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'flex',
    },
  },
})

export const tag = style({
  marginLeft: theme.spacing[3],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      marginLeft: 0,
      marginTop: -theme.spacing[7],
      marginBottom: theme.spacing[2],
    },
  },
})

export const list = style({
  display: 'flex',
  flexDirection: 'row',

  padding: '20px 24px',

  backgroundColor: theme.color.purple100,
  overflowX: 'hidden',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      flexDirection: 'column',

      padding: 0,

      backgroundColor: 'transparent',
    },
  },
})

export const listWithHead = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      marginTop: theme.spacing[4],
    },
  },
})
