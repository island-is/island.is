import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const mobileRow = style({
  '::after': {
    content: '',
    position: 'absolute',
    bottom: 0,
    left: `-${theme.spacing[2]}px`,
    right: `-${theme.spacing[2]}px`,
    height: '1px',
    background: theme.border.color.standard,
  },
})

export const line = style({
  borderLeft: `2px solid ${theme.color.blue400}`,
  width: 0,
  height: 'calc(100% + 1px)',
  left: 0,
  top: 0,
  zIndex: 10,
  position: 'absolute',
})

export const container = style({
  '::before': {
    content: '',
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: -1,
    left: `-${theme.spacing[2]}px`,
    right: `-${theme.spacing[2]}px`,
    background: theme.color.blue100,
  },
})
