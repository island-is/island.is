import { style, styleMap } from 'treat'
import { theme } from '@island.is/island-ui/theme'
import * as mixins from './Input.mixins'

export const containerDisabled = style({})

export const container = style({
  ...mixins.container,
  boxSizing: 'border-box',
  selectors: {
    [`&:hover:not(${containerDisabled})`]: mixins.containerHover,
    [`&${containerDisabled}`]: mixins.containerDisabled,
  },
})

export const containerBackgrounds = styleMap({
  white: {
    backgroundColor: theme.color.white,
  },
  blue: {
    backgroundColor: theme.color.blue100,
  },
})

export const input = style({
  ...mixins.input,
  '::placeholder': mixins.inputPlaceholder,
  ':focus': mixins.inputFocus,
  ':disabled': mixins.inputDisabled,
})

export const textarea = style({
  ...mixins.textarea,
})

export const errorMessage = style(mixins.errorMessage)

export const hasError = style({
  ...mixins.inputErrorState,
})

export const label = style({
  ...mixins.label,
  selectors: {
    [`${hasError} &`]: mixins.labelErrorState,
  },
})

export const labelDisabledEmptyInput = style(mixins.labelDisabledEmptyInput)

export const isRequiredStar = style({
  color: theme.color.red400,
})

export const hasFocus = style({
  selectors: {
    [`&${container}`]: mixins.containerFocus,
  },
})
