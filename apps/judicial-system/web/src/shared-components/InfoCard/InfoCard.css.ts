import { theme } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const infoCardContainer = style({
  background: theme.color.blue100,
  borderRadius: theme.border.radius.large,
  padding: theme.spacing[3],
})

export const infoCardTitleContainer = style({
  borderBottom: `2px solid ${theme.color.blue200}`,
  marginBottom: theme.spacing[3],
  paddingBottom: theme.spacing[3],
})

export const infoCardDataContainer = style({
  display: 'flex',
  flexWrap: 'wrap',
})

export const infoCardData = style({
  flex: '50%',
})
