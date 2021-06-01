import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  width: '100%',
  columnGap: theme.spacing[3],
  rowGap: theme.spacing[4],
})
