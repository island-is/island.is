import { style, globalStyle } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const tableContainer = style({
  width: '100%',
  backgroundColor: theme.color.white,
  border: `1px solid ${theme.color.blue200}`,
})

globalStyle(`${tableContainer} th, td`, {
  paddingRight: theme.spacing[3],
  paddingLeft: theme.spacing[3],
  paddingTop: theme.spacing[2],
  paddingBottom: theme.spacing[2],
})

globalStyle(`${tableContainer} tr:first-child`, {
  boxShadow: `inset 0px -1px 0px ${theme.color.blue200}`,
})

export const headlineContainer = style({
  backgroundColor: theme.color.blue100,
  fontSize: '12px',
  color: '#66668A',
  fontWeight: 600,
})

globalStyle(`${headlineContainer} td`, {
  paddingTop: theme.spacing[1],
  paddingBottom: theme.spacing[1],
})
