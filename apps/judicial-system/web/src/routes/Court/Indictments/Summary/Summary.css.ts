import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const ruling = style({
  display: 'flex',
  justifyContent: 'center',
  border: `1px solid ${theme.color.blue200}`,
  width: '100%',
  height: '500px',
  overflow: 'auto',
  marginBottom: theme.spacing[5],
  marginTop: -theme.spacing[1],
})

export const loading = style({
  paddingTop: '230px',
})
