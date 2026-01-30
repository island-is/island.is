import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const iconContainer = style({
  width: 32,
  height: 32,
  backgroundColor: theme.color.blue100,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const icon = style({
  width: 20,
  height: 20,
})
