import { theme } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const breakSpaces = style({
  whiteSpace: 'break-spaces',
})

export const infoSection = style({
  padding: `${theme.spacing[5]}px 0`,
  borderTop: `2px solid ${theme.color.purple100}`,
})

export const createGoProCaseContainer = style({
  display: 'grid',
  gridTemplateColumns: '144px 1fr',
  columnGap: theme.spacing[2],
})
