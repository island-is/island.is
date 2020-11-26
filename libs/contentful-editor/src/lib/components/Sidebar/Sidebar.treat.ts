import { globalStyle, style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const wrapper = style({
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  zIndex: 98,

  padding: theme.spacing['2'],
  paddingBottom: theme.spacing['12'],
  width: 800,

  overflowY: 'scroll',
  backgroundColor: theme.color.white,
  boxShadow: '1px 0 24px 4px rgba(0, 0, 0, 0.1)',
})

export const overlay = style({
  position: 'fixed',
  top: 0,
  right: 0,
  left: 0,
  bottom: 0,
  zIndex: 97,

  backgroundColor: 'rgba(0, 0, 0, 0.25)',
})

globalStyle(`${wrapper} a`, {
  color: `${theme.color.blue600} !important`,
})

globalStyle(`${wrapper} input`, {
  padding: theme.spacing['2'],
  border: '1px solid #c3cfd5',
  borderRadius: '4px',
  backgroundColor: '#fff',
})
