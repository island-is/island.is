import { style } from 'treat'

export const container = style({
  display: 'flex',
  justifyContent: 'space-between',
})

export const link = style({
  display: 'inline-block',
  textAlign: 'center',
  fontSize: 18,
  fontWeight: 300,
  minWidth: 40,
  height: 40,
  lineHeight: '40px',
  borderRadius: '20px',
  margin: '0 3px',
  padding: '0 8px',
  transition: 'transform .1s',
})

export const linkCurrent = style({
  backgroundColor: '#F8F5FA',
  fontWeight: 600,
  color: '#6A2EA0',
})

export const edge = style({
  backgroundColor: '#F8F5FA',
  ':hover': {
    transform: 'scale(1.1)',
  },
})

export const linkDisabled = style({
  border: '1px solid #E1D5EC',
})

export const gap = style({
  color: '#E1D5EC',
})
