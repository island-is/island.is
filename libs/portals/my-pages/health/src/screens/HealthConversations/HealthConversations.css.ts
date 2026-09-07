import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const messageCard = style(
  themeUtils.responsiveStyle({
    xs: {
      borderWidth: 0,
      borderRadius: 0,
    },
    sm: {
      borderStyle: theme.border.style.solid,
      borderWidth: theme.border.width.standard,
      borderColor: theme.color.blue200,
      borderRadius: theme.border.radius.large,
    },
  }),
)

export const attachmentIcon = style({
  width: 20,
  height: 20,
})

export const detailHeader = style({
  minHeight: 32,
  ...themeUtils.responsiveStyle({
    md: {
      minHeight: 40,
    },
  }),
})

// The back arrow is a 40px circle button with a 20px icon; pull it left so
// the arrow glyph stays flush with the content edge.
export const backButton = style({
  marginLeft: -10,
})

// Keeps the row's white button hover circle on a tinted background
export const conversationRow = style({
  selectors: {
    '&:hover': {
      backgroundColor: theme.color.blue100,
    },
  },
})
