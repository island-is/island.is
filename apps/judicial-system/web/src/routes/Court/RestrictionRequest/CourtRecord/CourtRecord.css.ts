import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const accusedPleaDecision = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: theme.spacing[1],
  marginBottom: theme.spacing[1],
})
