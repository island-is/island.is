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
  marginTop: -theme.spacing[7],
  marginBottom: theme.spacing[2],
})

export const list = style({
  display: 'flex',
  flexDirection: 'row',

  padding: '20px 24px',

  backgroundColor: theme.color.purple100,
  overflowX: 'scroll',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      flexDirection: 'column',

      padding: 0,

      backgroundColor: 'transparent',
      overflowX: 'hidden',
    },
  },
})

export const listWithHead = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      marginTop: theme.spacing[4],
    }
  }
})
