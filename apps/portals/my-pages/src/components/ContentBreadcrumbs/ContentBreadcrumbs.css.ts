import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const breadcrumbs = style({})

export const link = style({
  ':hover': {
    color: theme.color.blueberry400,
  },
})

globalStyle(`${breadcrumbs} ${link}:hover`, {
  textDecoration: 'underline',
})
