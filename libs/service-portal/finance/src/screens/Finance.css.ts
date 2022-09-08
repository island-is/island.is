import { style, globalStyle } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const dateFilter = style({
  marginTop: -theme.spacing[4],
  paddingBottom: theme.spacing[2],
})

export const dateFilterSingle = style({
  paddingBottom: theme.spacing[2],
})

export const accordionBox = style({})

export const accordionBoxSingle = style({})

/**
 * Open date picker margin needed as filter box is too small when calendar is expanded.
 */
globalStyle(`${accordionBox} .react-datepicker__tab-loop`, {
  marginTop: theme.spacing[6],
})

globalStyle(`${accordionBoxSingle} .react-datepicker__tab-loop`, {
  marginTop: theme.spacing[12],
})
