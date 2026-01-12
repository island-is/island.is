import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const searchBox = style({
  outline: 'none',
  padding: `8px 0 2px ${theme.spacing[2]}px`,
  fontSize: '24px',
  fontWeight: theme.typography.light,
  backgroundColor: theme.color.blue100,
  border: 0,
  color: theme.color.black,
})

export const image = style({
  width: '100%',
  maxWidth: '546px',
})
