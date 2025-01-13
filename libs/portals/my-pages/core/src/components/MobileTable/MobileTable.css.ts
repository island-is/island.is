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
