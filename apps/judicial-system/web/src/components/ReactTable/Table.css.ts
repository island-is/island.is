import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const header = style({
  background: theme.color.blue100,
})

export const table = style({
  borderCollapse: 'collapse',
  width: '100%',
})

globalStyle(`${table} td, th`, {
  borderBottomWidth: 1,
  borderBottomStyle: 'solid',
  borderBottomColor: theme.color.blue200,
  paddingLeft: theme.spacing[3],
  paddingRight: theme.spacing[3],
  paddingTop: theme.spacing[2],
  paddingBottom: theme.spacing[2],
  textAlign: 'left',
})

export const expandLabel = style({
  color: theme.color.blue400,
  cursor: 'pointer',
})

export const row = style({
  cursor: 'pointer',
})
