import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const sectionNumber = style({
  borderRadius: '50%',
  fontWeight: theme.typography.semiBold,
  height: '32px',
  left: '-16px',
  top: 'calc(50% - 16px)',
  width: '32px',
})

export const sectionNumberText = style({
  marginLeft: '-1px',
})

export const sectionNumberNotStarted = style({
  background: theme.color.white,
  border: `1px solid ${theme.color.blue200}`,
  color: theme.color.blue200,
})

export const sectionNumberInProgress = style({
  background: theme.color.blue100,
  border: `1px solid ${theme.color.blue200}`,
  color: theme.color.blue400,
})

export const sectionNumberRequiresAction = style({
  background: theme.color.red100,
  color: theme.color.red600,
})

export const sectionNumberComplete = style({
  background: theme.color.purple400,
})
