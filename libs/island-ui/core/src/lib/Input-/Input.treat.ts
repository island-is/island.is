import { style } from 'treat'
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

export const input = style({
  ...mixins.input,
  '::placeholder': mixins.inputPlaceholder,
  ':focus': mixins.inputFocus,
  ':disabled': mixins.inputDisabled,
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

export const hasFocus = style({
  selectors: {
    [`&${container}`]: mixins.containerFocus,
  },
})
