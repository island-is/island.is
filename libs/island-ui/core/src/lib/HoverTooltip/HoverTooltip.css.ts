import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const tooltip = style({
  display: 'inline-flex',
  alignItems: 'center',
  height: theme.spacing[3],
  padding: `0 ${theme.spacing[1]}px`,
  borderRadius: theme.border.radius.full,
  backgroundColor: theme.color.interactiveBackgroundTooltip,
  opacity: 0.8,
  color: theme.color.white,
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.regular,
  fontSize: 14,
  lineHeight: '16px',
  letterSpacing: 0,
  textAlign: 'center',
  whiteSpace: 'nowrap',
  zIndex: theme.zIndex.aboveModalBackdrop,
})
