// eslint-disable-next-line @typescript-eslint/no-var-requires
const figmaTokens = require('./figmaTokens.json')

// Primitives
const primitives = figmaTokens[0]['00 Primitives'].modes['Mode 1']

export const colorPrimitives = primitives.color
export const fontPrimitives = primitives.font
export const radiusPrimitives = primitives.radius
export const spacingPrimitives = primitives.spacing

// Color Tokens
export const colorTokensLight =
  figmaTokens[1]['01 Colors Tokens'].modes['Light Mode']

export const backgroundColors = colorTokensLight.background
export const borderColors = colorTokensLight.border
export const feedbackColors = colorTokensLight.feedback
export const foregroundColors = colorTokensLight.foreground
export const interactiveColors = colorTokensLight.interactive
export const overlayColors = colorTokensLight.overlay

// Typography Tokens
export const typographyDesktopTokens =
  figmaTokens[2]['02 Typography Tokens'].modes['Desktop']
export const typographyMobileTokens =
  figmaTokens[2]['02 Typography Tokens'].modes['Mobile']
