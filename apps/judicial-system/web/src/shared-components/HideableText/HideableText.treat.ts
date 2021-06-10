import { theme } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const hideableTextContainer = style({
  display: 'grid',
  gridTemplateColumns: `1fr ${theme.spacing[6]}px`,
  alignItems: 'center',
  justifyItems: 'right',
})
