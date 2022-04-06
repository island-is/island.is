import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  minHeight: '800px',
})

export const orderByToggleButton = style({
  display: 'flex',
  flexDirection: 'row',
  cursor: 'pointer',
  alignItems: 'center',
  padding: '4px',
})

export const orderByToggleButtonText = style({
  textDecoration: 'underline',
  fontSize: '14px',
  marginRight: '4px',
})

export const orderByItemContainer = style({
  position: 'absolute',
  background: 'white',
  zIndex: 10,
  border: `1px solid ${theme.color.dark100}`,
  borderRadius: '6px',
  boxShadow: '0px 4px 30px rgba(0, 97, 255, 0.16)',
})
