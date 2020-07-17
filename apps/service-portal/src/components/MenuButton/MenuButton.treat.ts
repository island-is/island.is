import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

const speed = '150ms'

export const menuButton = style({
  display: 'inline-flex',
  position: 'relative',
  justifyContent: 'center',
  alignItems: 'center',
  outline: 0,
  border: 0,
  height: '100%',
  cursor: 'pointer',
  fontFamily: 'IBM Plex Sans, sans-serif',
  fontStyle: 'normal',
  fontWeight: theme.typography.semiBold,
  transition: `color ${speed} ease, background-color ${speed} ease`,
  ':disabled': {
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },
  ':focus': {
    color: theme.color.blue400,
    backgroundColor: '#F2F2F5',
  },
  ':hover': {
    textDecoration: 'none',
    backgroundColor: '#F1F1F1',
  },
  ':before': {
    content: "''",
    position: 'absolute',
    pointerEvents: 'none',
    height: '100%',
    width: '1px',
    background: '#F2F2F5',
    top: 0,
    left: 0,
  },
})
