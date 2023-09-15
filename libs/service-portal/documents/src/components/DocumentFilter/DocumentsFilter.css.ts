import { globalStyle, style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const unreadFilter = style({
  marginBottom: -theme.spacing[4],
})

export const dateFilter = style({
  marginTop: -theme.spacing[4],
  paddingBottom: theme.spacing[2],
})

export const firstDatePicker = style({})

export const secondDatePicker = style({})

globalStyle(
  `${firstDatePicker} .island-ui-datepicker .react-datepicker-popper[data-placement^="top"]`,

  {
    top: '-16px !important',
    ...themeUtils.responsiveStyle({
      sm: {
        top: '-21px !important',
      },
      md: {
        top: '-12px !important',
      },
    }),
  },
)

globalStyle(
  `${secondDatePicker} .island-ui-datepicker .react-datepicker-popper[data-placement^="top"]`,
  {
    top: '29px !important',
  },
)
