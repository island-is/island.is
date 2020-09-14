import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const root = style({
  background: theme.color.white,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',

  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      // https://github.com/seek-oss/treat/issues/120
      minHeight: '-webkit-fill-available',
    },
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      background: theme.color.purple100,
    },
  },
})
