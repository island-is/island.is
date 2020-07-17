import { style } from 'treat'

export const navigationWrapper = style({
  position: 'relative',
})

export const navigation = style({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  marginLeft: '50px',
})

export const iconWrapper = style({
  background: 'tomato',
  padding: '10px',
  borderRadius: '50%',
  position: 'absolute',
  height: 'auto',
  left: '-50px',
})

export const itemContainer = style({
  position: 'absolute',
  backgroundColor: '#FFF',
})
