import { theme } from '../styles'

export const label = {
  display: 'block',
  width: '100%',
  color: theme.blue400,
  fontWeight: theme.fontWeightSemiBold,
  fontSize: theme.inputLabelFontSize,
  marginBottom: theme.spacer1,
  transition: 'color 0.1s',
}

export const container = {
  backgroundColor: theme.white,
  width: '100%',
  border: `1px solid ${theme.blue200}`,
  borderRadius: theme.inputBorderRadius,
  padding: theme.inputContainerPadding,
  cursor: 'text',
  transition: 'box-shadow 0.1s, border-color 0.1s',
}

export const containerHover = {
  borderColor: theme.blue400,
}

export const containerFocus = {
  outline: 'none',
  boxShadow: `0 0 0 4px ${theme.mint400}`,
}

export const input = {
  caretColor: theme.blue400,
  fontFamily: theme.fontFamily,
  fontWeight: theme.fontWeightSemiBold,
  fontSize: theme.h3FontSize,
  padding: theme.inputPadding,
  border: 'none',
  width: '100%',
  background: 'none',
  boxShadow: 'none',
}

export const inputPlaceholder = {
  color: theme.dark300,
  fontWeight: theme.fontWeightLight,
}

export const inputFocus = {
  outline: 'none',
}

export const placeholder = {
  color: theme.dark300,
  fontWeight: theme.fontWeightLight,
  fontSize: theme.h3FontSize,
  padding: theme.inputPadding,
  width: '100%',
}

export const errorMessage = {
  display: 'inline-block',
  color: theme.red400,
  fontWeight: theme.fontWeightSemiBold,
  fontSize: theme.inputLabelFontSize,
  marginTop: theme.spacer1,
}

export const inputErrorState = {
  borderColor: theme.red400,
}

export const labelErrorState = {
  color: theme.red400,
}
