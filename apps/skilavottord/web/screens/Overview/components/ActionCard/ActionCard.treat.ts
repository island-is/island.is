import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const rightContainer = style({
  backgroundColor: theme.color.blue100,
  borderTopRightRadius: theme.border.radius.large,
  borderBottomRightRadius: theme.border.radius.large,
  borderTopLeftRadius: theme.border.radius.large,
  borderBottomLeftRadius: theme.border.radius.large
})

export const buttonContainer = style({
  backgroundColor: theme.color.blue100,
  color: theme.color.white,
})

export const textContainer = style({
  backgroundColor: theme.color.white,
  borderColor: theme.color.blue200,
  borderLeftWidth: 1,
  borderStyle: 'solid',
})
