import { theme } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const dateTimeContainer = style({
  display: 'grid',
  gridTemplateColumns: '2fr minmax(180px, 1fr)',
  columnGap: theme.spacing[2],
})
