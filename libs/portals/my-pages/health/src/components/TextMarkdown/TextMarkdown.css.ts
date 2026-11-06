import { theme, themeUtils } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const container = style({})

// Markdown leaves paragraphs at the 18px base size; match Text variant="default"
globalStyle(`${container} p`, {
  fontSize: 16,
  ...themeUtils.responsiveStyle({
    md: { fontSize: theme.typography.baseFontSize },
  }),
})
