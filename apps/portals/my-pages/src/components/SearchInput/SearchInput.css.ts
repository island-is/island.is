import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const item = style({
  display: 'block',
  background: theme.color.blue100,
  padding: `${theme.spacing[1]}px ${theme.spacing[3]}px`,
  ':hover': {
    background: theme.color.white,
  },
})

export const active = style({
  borderColor: theme.color.blue400,
  borderStyle: theme.border.style.solid,
  borderWidth: theme.border.width.standard,
  borderRadius: theme.border.radius.standard,
})
