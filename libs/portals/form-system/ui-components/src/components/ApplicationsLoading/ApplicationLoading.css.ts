import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

const headerHeight = 112

export const root = style({
  minHeight: '-webkit-fill-available',
  display: 'flex',
  flexDirection: 'column',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      minHeight: `calc(100vh - ${headerHeight}px)`,
    },
  },
})
