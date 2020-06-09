import { style } from 'treat'
import { theme } from '../../theme'

export const container = style({
  width: '400px',
  margin: '0 12px',
  outline: '1px solid red',
  background: theme.color.mint300,
  boxShadow: `0px 4px 30px ${theme.color.red400}`,
})

export const inner = style({
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid green',
  height: '100%',
  backgroundColor: theme.color.white,
  borderRadius: '5px',
  overflow: 'hidden',
})

export const image = style({
  display: 'inline-block',
  width: '100%',
  height: '220px',
  minHeight: '220px',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center',
})

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  height: '100%',
  border: '2px solid purple',
})
