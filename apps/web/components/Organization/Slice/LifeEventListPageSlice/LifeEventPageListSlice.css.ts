import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const profileCardContainer = style({
  display: 'grid',
  gap: '24px',
  '@media': {
    [`screen and (min-width: 0px)`]: {
      gridTemplateColumns: '1fr',
    },
    [`screen and (min-width: 400px)`]: {
      gridTemplateColumns: '1fr 1fr',
    },
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      gridTemplateColumns: '1fr',
    },
    [`screen and (min-width: 950px)`]: {
      gridTemplateColumns: '1fr 1fr',
    },
    [`screen and (min-width: 1200px)`]: {
      gridTemplateColumns: '1fr 1fr 1fr',
    },
  },
})
