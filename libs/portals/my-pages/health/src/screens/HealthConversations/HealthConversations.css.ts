import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const messageCard = style({
  borderStyle: theme.border.style.solid,
  borderWidth: theme.border.width.standard,
  borderColor: theme.color.blue200,
  borderRadius: theme.border.radius.large,
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      borderWidth: 0,
      borderRadius: 0,
    },
  },
})

export const backButton = style({})

globalStyle(
  `${backButton} span, ${backButton} span:hover, ${backButton} span:focus`,
  {
    boxShadow: 'none',
  },
)
