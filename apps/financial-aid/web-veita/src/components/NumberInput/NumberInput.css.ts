import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const inputStyle = style({
  width: '100%',
  height: theme.spacing[10],
  borderRadius: theme.spacing[1],
  border: '1px',
  borderStyle: 'solid',
  borderColor: theme.color.blue200,
  backgroundColor: theme.color.blue100,
  fontWeight: theme.typography.light,
  fontSize: theme.spacing[3],
  padding: theme.spacing[3],
  // ':empty::before': {
  //   color: theme.color.dark300,
  // },
  // 'not(:empty)::after': {
  //   content: "' kr.'",
  //   marginLeft: theme.spacing[1],
  //   display: 'inline-block',
  // },
})
