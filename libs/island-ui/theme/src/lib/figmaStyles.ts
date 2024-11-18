// eslint-disable-next-line @typescript-eslint/no-var-requires
const designTokens = require('./designTokens.json')

// Primitives
export const colorPrimitives =
  designTokens[0]['00 Primitives'].modes['Mode 1']['color']
export const fontPrimitives =
  designTokens[0]['00 Primitives'].modes['Mode 1']['font']
export const radiusPrimitives =
  designTokens[0]['00 Primitives'].modes['Mode 1']['radius']
export const spacingPrimitives =
  designTokens[0]['00 Primitives'].modes['Mode 1']['spacing']

// Color Tokens
export const colorTokensLight =
  designTokens[1]['01 Colors Tokens'].modes['Light Mode']

const backgroundColors = colorTokensLight.background
const borderColors = colorTokensLight.border
const feedbackColors = colorTokensLight.feedback
const foregroundColors = colorTokensLight.foreground
const interactiveColors = colorTokensLight.interactive
const overlayColors = colorTokensLight.overlay
console.log(
  backgroundColors,
  borderColors,
  feedbackColors,
  foregroundColors,
  interactiveColors,
  overlayColors,
) // test

// Typography Tokens
export const typographyDesktopTokens =
  designTokens[2]['02 Typography Tokens'].modes['Desktop']
export const typographyMobileTokens =
  designTokens[2]['02 Typography Tokens'].modes['Mobile']
