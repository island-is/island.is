import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'
import { borderColor } from 'libs/island-ui/core/src/lib/Box/useBoxStyles.treat'

export const iconWrapper = style({
  backgroundColor: theme.color.mint400,
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '56px',
  width: '56px',
  
})

export const cancelButton = style({
  borderColor: theme.color.red400,
  borderWidth: 1,
})

export const cancelButtonText = style({
  color: theme.color.red400,
  borderColor: theme.color.red400,
  borderWidth: 1,
})
