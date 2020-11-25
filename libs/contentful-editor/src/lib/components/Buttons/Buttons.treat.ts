import { style } from 'treat'

export const wrapper = style({
  display: 'flex',
  alignItems: 'center',

  position: 'fixed',
  left: 0,
  bottom: 0,
  zIndex: 9999,

  width: 800,
  height: 100,
  paddingLeft: 20,
})

export const edit = style({
  boxShadow: '0 0 12px 4px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#fff',
})
