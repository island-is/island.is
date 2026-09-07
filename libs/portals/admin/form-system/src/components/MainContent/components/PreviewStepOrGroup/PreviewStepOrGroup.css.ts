import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const stepperPanel = style({
  position: 'fixed',
  top: 0,
  right: 0,
  height: '100vh',
  width: '100%',
  maxWidth: 400,
  transform: 'translateX(100%)',
  transition: 'transform 300ms ease-in-out, opacity 300ms ease-in-out',
  boxShadow: theme.shadows.large,
  overflowY: 'auto',
  selectors: {
    '&[data-enter]': {
      transform: 'translateX(0)',
    },
  },
})
