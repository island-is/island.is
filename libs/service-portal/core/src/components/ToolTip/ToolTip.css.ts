import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const tooltip = style({
  display: 'inline-block',
  backgroundColor: '#00003C',
  borderRadius: theme.border.radius.large,
  padding: theme.spacing[1],
  maxWidth: '240px',
  transition: theme.transitions.fast,
  opacity: 0,
  transformOrigin: 'top center',
  transform: 'translate3d(0, -10px, 0)',
  fontWeight: theme.typography.light,
  fontSize: 14,
  lineHeight: '1rem',
  fontFamily: theme.typography.fontFamily,
  color: theme.color.white,
  selectors: {
    '[data-enter] &': {
      opacity: 1,
      transform: 'translate3d(0, -5px, 0)',
    },
  },
})

export const light = style({
  backgroundColor: theme.color.blue100,
  color: theme.color.dark400,
  border: `1px solid ${theme.color.blue200}`,
  padding: theme.spacing[2],
})

export const icon = style({
  display: 'inline-block',
  lineHeight: 1,
  position: 'relative',
})

export const fullWidth = style({
  maxWidth: '100%',
  whiteSpace: 'pre-line',
})

globalStyle(`${icon}:hover path`, {
  fill: theme.color.blue400,
})

export const z = style({
  zIndex: 102,
})
