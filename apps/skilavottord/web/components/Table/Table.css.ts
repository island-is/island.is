import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  overflow: 'auto',
})
export const table = style({
  textAlign: 'left',
  width: '100%',
  borderCollapse: 'collapse',
  overflow: 'hidden',
})
export const tr = style({
  boxShadow: 'inset 0px -1px 0px #CCDFFF',
})
export const tHead = style({
  backgroundColor: theme.color.blue100,
})
export const td = style({
  paddingLeft: theme.spacing[4],
  paddingRight: theme.spacing[1],
  paddingTop: theme.spacing[3],
  paddingBottom: theme.spacing[3],
})

export const tdHead = style({
  paddingLeft: theme.spacing[4],
  paddingRight: theme.spacing[1],
  paddingTop: theme.spacing[2],
  paddingBottom: theme.spacing[2],
})

export const alignRight = style({
  textAlign: 'right',
})

export const block = style({
  display: 'block',
})
