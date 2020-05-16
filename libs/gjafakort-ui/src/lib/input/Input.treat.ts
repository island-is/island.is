import { style } from 'treat'
import * as mixins from './Input.mixins'

export const container = style({
  ...mixins.container,
  boxSizing: 'border-box',
  ':hover': mixins.containerHover,
})

export const input = style({
  ...mixins.input,
  '::placeholder': mixins.inputPlaceholder,
  ':focus': mixins.inputFocus,
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

export const hasFocus = style({
  selectors: {
    [`${container} &`]: mixins.containerFocus,
  },
})
