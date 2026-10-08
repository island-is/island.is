import { theme, themeUtils } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

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

export const senderName = style({
  minWidth: 0,
  overflowWrap: 'anywhere',
})

export const attachmentIcon = style({
  width: 20,
  height: 20,
  flexShrink: 0,
})

export const certificateAvatar = style({
  width: 64,
  height: 64,
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

// Same 10px of empty circle sits below the glyph, so 22 reads as the 32 the
// design has between the arrow and the page title.
export const mobileBackHeader = style({
  marginBottom: 22,
})

// Keeps the row's white button hover circle on a tinted background
export const conversationRow = style({
  '@media': {
    '(hover: hover)': {
      selectors: {
        '&:hover': {
          backgroundColor: theme.color.blue100,
        },
      },
    },
  },
})

export const sentAlert = style({
  outline: 'none',
})

export const termsCheckbox = style({})

globalStyle(`${termsCheckbox} label`, {
  alignItems: 'flex-start',
})

globalStyle(`${termsCheckbox} label > div`, {
  alignSelf: 'flex-start',
  marginTop: 2,
})

export const messageTextContent = style({
  whiteSpace: 'pre-line',
  overflowWrap: 'anywhere',
})

export const messageSegmentedContent = style({
  overflowWrap: 'anywhere',
})
