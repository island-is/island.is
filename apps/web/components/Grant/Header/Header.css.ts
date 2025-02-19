import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const searchBox = style({
  outline: 'none',
  marginTop: theme.spacing[2],
  marginBottom: theme.spacing[1],
  marginLeft: theme.spacing[2],
  marginRight: -theme.spacing[2],
  fontSize: '24px',
  fontWeight: theme.typography.light,
  backgroundColor: theme.color.blue100,
  border: 0,
  color: theme.color.black,
})

export const image = style({
  maxWidth: '100%',
})
