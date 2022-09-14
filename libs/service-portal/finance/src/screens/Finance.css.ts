import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const dateFilter = style({
  marginTop: -theme.spacing[4],
  paddingBottom: theme.spacing[2],
})

export const dateFilterSingle = style({
  paddingBottom: theme.spacing[2],
})

export const openCal = style({
  paddingTop: '260px',
})

export const openLowerCal = style({
  paddingTop: '165px',
})
