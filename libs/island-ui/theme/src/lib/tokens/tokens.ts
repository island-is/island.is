// eslint-disable-next-line @typescript-eslint/no-var-requires
const figmaTokens = require('./figmaTokens.json')

// Primitives
const primitives = figmaTokens[0]['00 Primitives'].modes['Mode 1']
export const { color, font, radius, spacing } = primitives

// Color Tokens
const colorTokensLight = figmaTokens[1]['01 Colors Tokens'].modes['Light Mode']
export const {
  background,
  border,
  feedback,
  foreground,
  interactive,
  overlay,
} = colorTokensLight

// Typography Tokens
export const typographyDesktopTokens =
  figmaTokens[2]['02 Typography Tokens'].modes['Desktop']
export const typographyMobileTokens =
  figmaTokens[2]['02 Typography Tokens'].modes['Mobile']
