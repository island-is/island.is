import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const dateFilter = style({
  marginTop: -theme.spacing[4],
  paddingBottom: theme.spacing[2],
})

export const dateFilterSingle = style({
  paddingBottom: theme.spacing[2],
})

export const accordionBox = style({})
export const accordionBoxSingle = style({})

globalStyle(
  `${accordionBox} .island-ui-datepicker .react-datepicker-popper[data-placement^="top"]`,
  {
    top: '30px !important',
  },
)

globalStyle(
  `${accordionBoxSingle} .island-ui-datepicker .react-datepicker-popper[data-placement^="top"]`,
  {
    top: '20px !important',
  },
)
