import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const menu = style({
  backgroundColor: theme.color.blue100,
  height: 96,
  width: '100%',
  margin: 0,
  paddingTop: theme.spacing[3],
  paddingBottom: theme.spacing[3],
  paddingLeft: theme.spacing[4],
  paddingRight: theme.spacing[4],
})
