import { theme } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const modal = style({
  position: 'absolute',
  top: 0,
  bottom: 0,
})

export const modalContent = style({
  position: 'absolute',
  top: '240px',
  left: '50%',
  width: '90%',
  maxWidth: '880px',
  transform: 'translateX(-50%)',
})

export const controlCode = style({
  color: theme.color.blue400,
  marginLeft: '8px',
})
