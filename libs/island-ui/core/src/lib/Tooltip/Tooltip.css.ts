import { globalStyle, style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const tooltip = style({
  display: 'inline-block',
  backgroundColor: theme.color.blue100,
  borderRadius: theme.border.radius.large,
  padding: theme.spacing[2],
  maxWidth: '240px',
  border: `1px solid ${theme.color.blue200}`,
  transition: theme.transitions.fast,
  opacity: 0,
  transformOrigin: 'top center',
  transform: 'translate3d(0, -10px, 0)',
  fontWeight: theme.typography.light,
  fontSize: '15px',
  lineHeight: '20px',
  fontFamily: theme.typography.fontFamily,
  color: theme.color.dark400,
  selectors: {
    '[data-enter] &': {
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
    },
  },
})

export const icon = style({
  display: 'inline-block',
  lineHeight: 1,
  position: 'relative',
})

globalStyle(`${icon}:hover path`, {
  fill: theme.color.blue400,
})
