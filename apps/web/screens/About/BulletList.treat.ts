import { style } from 'treat'
import {theme} from '@island.is/island-ui/theme'

export const row = style({
  display: 'flex',
})

export const leftCol = style({
  width: '90px',
  marginRight: '24px',
})

export const circle = style({
  position: 'relative',
  backgroundColor: theme.color.blue100,
  borderRadius: '50%',
  width: '100%',
  paddingTop: '100%',
  color: theme.color.blue400,
  margin: 'auto',
})

export const circleRed = style({
  backgroundColor: theme.color.red100,
  color: theme.color.red400,
})

export const circleSmall = style({
  width: '50%',
  paddingTop: '50%',
})

export const icon = style({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  height: 'auto',
  maxWidth: '60%',
  maxHeight: '60%',
})
