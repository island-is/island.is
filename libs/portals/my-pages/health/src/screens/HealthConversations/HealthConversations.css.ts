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

globalStyle(`${backButton} button`, {
  backgroundColor: theme.color.white,
  width: 40,
  height: 40,
  marginLeft: -10,
})

globalStyle(`${backButton} button:hover`, {
  backgroundColor: theme.color.blue100,
})

globalStyle(`${backButton} button svg`, {
  width: 20,
  height: 20,
})
