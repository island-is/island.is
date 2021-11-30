import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const wrapper = style({
  display: 'grid',
})

export const td = style({
  width: 'max-content',
})
export const alignTd = style({
  marginLeft: 'auto',
})

export const buttonTd = style({
  width: 'max-content',
  display: 'flex',
  alignItems: 'center',
})

export const buttonWrap = style({
  minWidth: theme.spacing[9],
  justifyContent: 'space-around',
  display: 'flex',
})

export const btnSpacer = style({
  marginLeft: theme.spacing[2],
  display: 'inline-flex',
})

export const loadingDot = style({
  position: 'absolute',
  margin: 'auto',
  height: 16,
  right: 0,
  top: 0,
  bottom: 0,
})
