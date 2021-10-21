import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  display: 'flex',
  position: 'relative',
  zIndex: 1,
  margin: '0 auto',
  maxWidth: 800,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
})

export const logoWrapper = style({
  display: 'flex',
  flexDirection: 'row',
  width: 150,
  height: 150,
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.color.white,
})

export const logo = style({
  width: 80,
  height: 80,
})

export const logoImg = style({
  display: 'inline-block',
  width: '100%',
  height: 'auto',
})
