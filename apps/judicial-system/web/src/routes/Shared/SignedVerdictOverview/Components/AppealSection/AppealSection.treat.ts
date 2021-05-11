import { theme } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const prosecutorAppealButton = style({
  marginBottom: theme.spacing[3],
})

export const buttonContainer = style({
  marginBottom: theme.spacing[2],
})

export const appealInnerWrapper = style({
  display: 'grid',
  gridTemplateColumns: '2fr auto',
  columnGap: theme.spacing[2],
})
