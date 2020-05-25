import { style } from 'treat'
import { theme } from '../../theme/'

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
  transform: 'rotate(0deg)',
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
