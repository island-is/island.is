import { theme } from '@island.is/island-ui/core'
import { style } from 'treat'

export const dateTimeContainer = style({
  display: 'grid',
  gridTemplateColumns: '1fr 256px',
  columnGap: theme.spacing[2],
})
