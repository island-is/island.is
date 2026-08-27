import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const searchButton = style({
  minWidth: '162px',
  width: 'fit-content',
})

export const pageSizeSelect = style({
  minWidth: '160px',
})

export const statsItem = style({
  flex: 1,
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm - 1}px)`]: {
      flex: '0 0 50%',
    },
  },
})
