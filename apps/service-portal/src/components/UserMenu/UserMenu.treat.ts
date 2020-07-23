import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const wrapper = style({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  padding: `0 ${theme.spacing['3']}px`,
})

export const avatar = style({
  width: 34,
  height: 34,
  marginRight: 20,
  backgroundColor: theme.color.red400,
  borderRadius: '100%',
})

export const username = style({
  fontWeight: theme.typography.medium,
  fontSize: 14,
})
