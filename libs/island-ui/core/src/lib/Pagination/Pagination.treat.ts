import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const link = style({
  display: 'inline-block',
  textAlign: 'center',
  fontSize: 18,
  fontWeight: 300,
  minWidth: 40,
  height: 40,
  lineHeight: '40px',
  borderRadius: '20px',
  margin: '0 4px',
  padding: '0 8px',
  transition: 'all .1s',
  ':hover': {
    color: theme.color.purple400,
    backgroundColor: theme.color.purple100,
    textDecoration: 'none',
  },
})

export const linkCurrent = style({
  backgroundColor: theme.color.purple100,
  fontWeight: 600,
  color: theme.color.purple400,
})

export const edge = style({
  margin: 0,
  backgroundColor: theme.color.purple100,
  ':hover': {
    transform: 'scale(1.1)',
  },
})

export const linkDisabled = style({
  border: `1px solid ${theme.color.purple200}`,
})

export const gap = style({
  display: 'inline-block',
  textAlign: 'center',
  margin: '0 4px',
  minWidth: 40,
})
