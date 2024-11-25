import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const BlueBoxContainer = style({
  background: theme.color.blue100,
  paddingTop: theme.spacing[3],
  paddingBottom: theme.spacing[3],
  paddingRight: theme.spacing[3],
  paddingLeft: theme.spacing[3],
  borderRadius: theme.border.radius.large,
})

export const small = style({
  paddingTop: theme.spacing[2],
  paddingBottom: theme.spacing[2],
})

export const center = style({
  textAlign: 'center',
})
