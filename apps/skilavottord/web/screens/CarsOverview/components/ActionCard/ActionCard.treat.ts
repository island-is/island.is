import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  width: '100%',
  backgroundColor: theme.color.white,
  borderStyle: 'solid',
  borderWidth: 1,
  borderRadius: theme.border.radius.large,
  borderColor: theme.color.blue200,
})

export const rightContainer = style({
  backgroundColor: theme.color.blue100,
  borderTopRightRadius: theme.border.radius.large,
  borderBottomRightRadius: theme.border.radius.large,
  borderTopLeftRadius: theme.border.radius.large,
  borderBottomLeftRadius: theme.border.radius.large
})

export const enabled = style({
  backgroundColor: theme.color.blue100,
  color: theme.color.white,
})

export const disabled = style({
  backgroundColor: theme.color.white,
  borderColor: theme.color.blue200,
  borderLeftWidth: 1,
  borderStyle: 'solid',
})
