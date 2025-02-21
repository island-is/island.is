import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const searchBox = style({
  outline: 'none',
  padding: `${theme.spacing[1]}px ${theme.spacing[3]}px `,
  fontSize: '24px',
  fontWeight: theme.typography.light,
  backgroundColor: theme.color.blue100,
  border: 0,
  color: theme.color.black,
})

export const image = style({
  maxWidth: '100%',
})
