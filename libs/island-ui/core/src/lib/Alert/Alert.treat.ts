import { styleMap, style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  borderRadius: 8,
  padding: 16,
})

export const containerVariants = styleMap({
  error: {
    backgroundColor: theme.color.red100,
    border: `1px solid ${theme.color.red200}`,
  },
  info: {
    backgroundColor: theme.color.blue100,
    border: `1px solid ${theme.color.blue200}`,
  },
})

export const titleContainer = style({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 4,
})

export const iconContainer = style({
  marginRight: 16,
})

export const messageContainer = style({
  marginLeft: 46,
})
