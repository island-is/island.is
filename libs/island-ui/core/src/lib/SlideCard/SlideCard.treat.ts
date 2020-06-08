import { style } from 'treat'
import { theme } from '../../theme'

export const container = style({
  display: 'flex',
  height: '100%',
  margin: '0 12px',
  borderRadius: '5px',
  boxShadow: `0px 4px 30px ${theme.color.blue100}`,
})

export const inner = style({
  backgroundColor: theme.color.white,
  borderRadius: '5px',
  overflow: 'hidden',
})

export const image = style({
  height: '220px',
  minHeight: '220px',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center',
})
