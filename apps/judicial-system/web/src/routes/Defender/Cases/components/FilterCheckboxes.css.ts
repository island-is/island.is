import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const gridRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 8fr',
  gridGap: theme.spacing[2],
  marginBottom: theme.spacing[3],
  marginTop: theme.spacing[4],
})
