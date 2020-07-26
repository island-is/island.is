import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const root = style({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  // https://github.com/seek-oss/treat/issues/120
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      minHeight: '-webkit-fill-available',
    },
  },
})
