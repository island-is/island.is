import { figmaColorsTokens } from './figmaColors'
import { figmaPrimitives } from './figmaPrimitives'
import { figmaTypographyTokens } from './figmaTypography'

// Primitives
export const { font, spacing, radius } = figmaPrimitives.modes.mode1
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
