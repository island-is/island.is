import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const searchBox = style({
  outline: 'none',
  paddingTop: theme.spacing[1],
  paddingBottom: theme.spacing[1],
  fontSize: '24px',
  fontWeight: theme.typography.light,
  backgroundColor: theme.color.blue100,
  border: 0,
  color: theme.color.black,
})

export const image = style({
  maxWidth: '100%',
})
