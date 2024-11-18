// eslint-disable-next-line @typescript-eslint/no-var-requires
const designTokens = require('./designTokens.json')

// Primitives
const primitives = designTokens[0]['00 Primitives'].modes['Mode 1']

export const colorPrimitives = primitives.color
export const fontPrimitives = primitives.font
export const radiusPrimitives = primitives.radius
export const spacingPrimitives = primitives.spacing

// Color Tokens
const colorTokensLight =
  designTokens[1]['01 Colors Tokens'].modes['Light Mode']

export const backgroundColors = colorTokensLight.background
export const borderColors = colorTokensLight.border
export const feedbackColors = colorTokensLight.feedback
export const foregroundColors = colorTokensLight.foreground
export const interactiveColors = colorTokensLight.interactive
export const overlayColors = colorTokensLight.overlay

// Typography Tokens
export const typographyDesktopTokens =
  designTokens[2]['02 Typography Tokens'].modes['Desktop']
export const typographyMobileTokens =
  designTokens[2]['02 Typography Tokens'].modes['Mobile']
