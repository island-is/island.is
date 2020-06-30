import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const button = style({})

export const icon = style({
  width: '40px',
  height: '40px',
  display: 'inline-flex',
  alignSelf: 'center',
  justifySelf: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.color.blue100,
  borderRadius: '50%',
  transform: 'rotate(0.000001deg)',
  transition: 'transform 300ms ease',
})

export const iconTilted = style({
  transform: 'rotate(45deg)',
})

export const focusRing = [
  style({
    selectors: {
      [`${button}:focus ~ &`]: {
        opacity: 1,
      },
    },
  }),
  style({
    top: -theme.spacing[1],
    bottom: -theme.spacing[1],
    left: -theme.spacing[1],
    right: -theme.spacing[1],
  }),
]

export const card = style({
  position: 'relative',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: '#CCDFFF',
  transition: 'border-color 150ms ease',
  borderRadius: '5px',
  ':hover': {
    borderColor: '#0061FF',
    textDecoration: 'none',
  },
  ':focus': {
    outline: 0,
  },
  ':before': {
    content: "''",
    display: 'inline-block',
    position: 'absolute',
    pointerEvents: 'none',
    borderStyle: 'solid',
    borderWidth: '3px',
    borderColor: '#E1D5EC',
    borderRadius: '7px',
    outline: 0,
    top: '-4px',
    left: '-4px',
    bottom: '-4px',
    right: '-4px',
    opacity: 0,
    transition: 'opacity 150ms ease',
  },
})

export const focused = style({
  ':before': {
    border: '3px solid #00E4CA',
    opacity: 1,
    outline: 0,
  },
})
