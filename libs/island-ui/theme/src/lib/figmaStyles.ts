// eslint-disable-next-line @typescript-eslint/no-var-requires
const designTokens = require('./designTokens.json')
console.log(designTokens)

export const colorTokensLight = designTokens[1]['01 Colors Tokens'].modes['Light Mode']

const backgroundColors = colorTokensLight.background
const borderColors = colorTokensLight.border
const feedbackColors = colorTokensLight.feedback
const foregroundColors = colorTokensLight.foreground
const interactiveColors = colorTokensLight.interactive
const overlayColors = colorTokensLight.overlay

console.log(backgroundColors, borderColors, feedbackColors, foregroundColors, interactiveColors, overlayColors)