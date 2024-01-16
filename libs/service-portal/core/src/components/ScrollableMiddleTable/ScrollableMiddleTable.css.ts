import { theme, themeUtils } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const table = style({
  textOverflow: 'ellipsis',
})

export const nestedTable = style({
  tableLayout: 'fixed',

  width: '200%',
  ...themeUtils.responsiveStyle({
    sm: {
      width: '350%',
    },
    lg: {
      width: '300%',
    },
    xl: {
      width: '250%',
    },
  }),
})

export const row = style({
  backgroundColor: theme.color.blue100,
})

export const firstColumn = style({
  borderRight: `1px solid ${theme.border.color.blue200} `,
  boxShadow: `4px 0px 8px -2px ${theme.border.color.blue200}`,
  left: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

export const lastColumn = style({
  borderLeft: `1px solid ${theme.border.color.blue200}`,
  boxShadow: `-4px 0px 8px -2px ${theme.border.color.blue200}`,
  right: 0,
})

export const sticky = style({
  position: 'sticky',
})

globalStyle(`${table} tbody tr:nth-child(odd) > td`, {
  backgroundColor: theme.color.white,
})
