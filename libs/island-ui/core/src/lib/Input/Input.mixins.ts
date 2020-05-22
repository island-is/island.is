import { theme } from '../../theme'

const containerPaddingTop = 7
const containerPaddingRight = 7
const containerPaddingBottom = 13
const containerPaddingLeft = 7
const containerPadding = `${containerPaddingTop}px ${containerPaddingRight}px ${containerPaddingBottom}px ${containerPaddingLeft}px`
const inputPadding = '0 16px'
const inputLabelFontSize = 14
const inputBorderRadius = 5

export const label = {
  display: 'block',
  width: '100%',
  color: theme.color.blue400,
  fontWeight: 500,
  fontSize: inputLabelFontSize,
  marginBottom: theme.spacing[1],
  transition: 'color 0.1s',
}

export const container = {
  backgroundColor: theme.color.white,
  width: '100%',
  border: `1px solid ${theme.color.blue200}`,
  borderRadius: inputBorderRadius,
  padding: containerPadding,
  cursor: 'text',
  transition: 'box-shadow 0.1s, border-color 0.1s',
}

export const input = {
  caretColor: theme.color.blue400,
  fontFamily: theme.fontFamily,
  fontWeight: 500,
  fontSize: 24,
  padding: inputPadding,
  border: 'none',
  width: '100%',
  background: 'none',
  boxShadow: 'none',
}

export const inputPlaceholder = {
  color: theme.color.dark300,
  fontWeight: 300,
}

export const placeholder = {
  color: theme.color.dark300,
  fontWeight: 300,
  fontSize: 24,
  padding: inputPadding,
  width: '100%',
}

// Error state
export const errorMessage = {
  display: 'inline-block',
  color: theme.color.red400,
  fontWeight: 500,
  fontSize: inputLabelFontSize,
  marginTop: theme.spacing[1],
}

export const inputErrorState = {
  borderColor: theme.color.red400,
}

export const labelErrorState = {
  color: theme.color.red400,
}

// Focus state
export const containerFocus = {
  outline: 'none',
  boxShadow: `0 0 0 4px ${theme.color.mint400}`,
}

export const inputFocus = {
  outline: 'none',
}

// Hover state
export const containerHover = {
  borderColor: theme.color.blue400,
}

// Disabled state
export const labelDisabledEmptyInput = {
  color: theme.color.blue300,
}

export const containerDisabled = {
  backgroundColor: theme.color.blue100,
}

export const inputDisabled = {
  backgroundColor: theme.color.blue100,
  color: theme.baseColor,
}
