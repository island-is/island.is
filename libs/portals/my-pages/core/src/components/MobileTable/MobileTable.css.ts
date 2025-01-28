import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  '::before': {
    content: '',
    position: 'absolute',
    top: 0,
    bottom: '-24px',
    zIndex: -1,
    left: `-${theme.spacing[2]}px`,
    right: `-${theme.spacing[2]}px`,
    background: theme.color.blue100,
    borderBottom: `1px solid ${theme.color.blue200}`,
  },
})

export const divider = style({
  '::after': {
    content: '',
    position: 'absolute',
    bottom: `-${theme.spacing[3]}px`,
    left: `-${theme.spacing[2]}px`,
    right: `-${theme.spacing[2]}px`,
    height: '1px',
    background: theme.color.blue200,
  },
})
