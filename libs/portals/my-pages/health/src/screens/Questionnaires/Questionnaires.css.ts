import { theme, themeUtils } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const select = style({
  minWidth: 250,
  marginTop: 0,
  paddingTop: 0,
})

export const button = style(
  themeUtils.responsiveStyle({
    md: {
      minWidth: 175, // minWidth from design
    },
  }),
)

// Same max width as Filter's fluid input so both tabs match
export const searchInput = style({
  maxWidth: 420,
})

export const toggleBox = style({})

export const toggleButton = style({
  fontSize: 16,
  marginBottom: 0,
})

export const answeredContainer = style({
  maxWidth: theme.breakpoints.xl,
})

globalStyle(`${toggleBox} > p`, {
  fontSize: 16,
})
