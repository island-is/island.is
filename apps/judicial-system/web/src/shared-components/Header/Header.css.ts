import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 112,
  borderBottom: `1px solid ${theme.color.blue200}`,
  padding: `0 ${theme.spacing[6]}px`,
})

export const headerTextWrapper = style({
  marginTop: '5px',
})

export const headerDiviter = style({
  display: 'inline-block',
  height: '19px',
  width: '2px',
  backgroundColor: theme.color.dark200,
  margin: `5px ${theme.spacing[3]}px 0 ${theme.spacing[3]}px`,
})
