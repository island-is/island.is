import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const tooltipContainer = style({})

export const tooltipButton = style({
  display: 'inline-block',
  lineHeight: 1,
  position: 'relative',
  backgroundColor: 'transparent',
  padding: 0,
  border: 0,
})

globalStyle(
  `${tooltipButton}:hover path, ${tooltipContainer}:has([role="tooltip"]:not([hidden])) ${tooltipButton} path`,
  { fill: theme.color.blue400 },
)
