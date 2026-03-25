import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const categoriesGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridGap: theme.spacing[3],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      gridTemplateColumns: '1fr 1fr',
    },
    [`screen and (min-width: 1250px)`]: {
      gridTemplateColumns: '1fr 1fr 1fr',
    },
  },
})

export const categoryCard = style({
  textAlign: 'left',
})
