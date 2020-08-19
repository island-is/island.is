import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  width: '100%',
  display: 'inline-block',
})

export const tabWrapper = style({
  display: 'inline-flex',
})

export const tabContainer = style({
  outline: 0,
})

export const content = style({
  display: 'flex',
  position: 'relative',
  width: '100%',
  //outline: '1px solid red',
})

export const tabPanel = style({
  position: 'absolute',
  top: 0,
  opacity: 0,
  pointerEvents: 'none',
  background: theme.color.blue100,
  outline: '1px solid green',
  transition: `opacity 1000ms ease`,
})

export const tabPanelVisible = style({
  opacity: 1,
  position: 'relative',
  display: 'inline-block',
  width: '100%',
  pointerEvents: 'initial',
})

export const tabBullet = style({
  width: 8,
  height: 8,
  backgroundColor: theme.color.red200,
  borderRadius: 8,
  marginRight: 16,
  transition: `all 300ms ease`,
})

export const tabBulletSelected = style({
  width: 32,
  backgroundColor: theme.color.red400,
})

export const srOnly = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  border: '0',
})

export const dots = style({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
})

export const image = style({
  position: 'relative',
  display: 'inline-block',
  width: '100%',
})

export const imageContainer = style({
  position: 'relative',
  display: 'flex',
  overflow: 'hidden',
  width: '100%',
  maxWidth: '440px',
  alignItems: 'center',
  justifyContent: 'center',
})
