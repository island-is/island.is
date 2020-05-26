import { style } from 'treat'
import { theme } from '../../theme'

export const tooltip = style({
  display: 'inline-block',
  backgroundColor: theme.color.white,
  borderRadius: '10px',
  padding: '16px',
  maxWidth: '240px',
  border: `1px solid ${theme.color.blue200}`,
  transition: theme.transitions.fast,
  opacity: 0,
  transformOrigin: 'top center',
  transform: 'translate3d(0, -10px, 0)',
  fontWeight: theme.typography.light,
  fontSize: '14px',
  fontFamily: theme.typography.fontFamily,
  lineHeight: '20px',
  color: theme.color.dark400,
  selectors: {
    '[data-enter] &': {
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
    },
  },
})

export const colored = style({
  backgroundColor: theme.color.blue100,
})

export const icon = style({
  display: 'inline-block',
  lineHeight: 1,
})
