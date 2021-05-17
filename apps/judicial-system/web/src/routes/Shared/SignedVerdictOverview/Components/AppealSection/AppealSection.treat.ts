import { theme } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const accusedAppealDatepicker = style({
  // marginBottom: theme.spacing[3],
})

export const appealContainer = style({
  height: 112,
  marginBottom: theme.spacing[3],
})

export const appealInnerWrapper = style({
  display: 'grid',
  gridTemplateColumns: '2fr auto',
  columnGap: theme.spacing[2],
})
