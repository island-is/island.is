import { figmaColorsTokens } from './figmaColors'
import { figmaTypographyTokens } from './figmaTypography'
import { figmaPrimitives } from './figmaPrimitives'

// Primitives
export const { color, font, spacing, radius } = figmaPrimitives.modes.mode1
// Color Tokens
const colorTokensLight = figmaColorsTokens.modes.lightMode

export const {
  background,
  border,
  feedback,
  foreground,
  interactive,
  overlay,
} = colorTokensLight

// Typography Tokens
export const typographyDesktopTokens = figmaTypographyTokens.modes.desktop
export const typographyMobileTokens = figmaTypographyTokens.modes.mobile
