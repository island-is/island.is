import { style, styleMap } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'
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

export const containerSizes = styleMap(mixins.containerSizes)

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

export const inputSize = styleMap(mixins.inputSizes)

// To handle styling auto-fill states
export const inputBackground = styleMap({
  white: {
    selectors: {
      '&:-webkit-autofill, &:-webkit-autofill:focus, &:-webkit-autofill:hover': {
        boxShadow: `0 0 0px 1000px ${theme.color.white} inset`,
      },
    },
  },
  blue: {
    selectors: {
      '&:-webkit-autofill, &:-webkit-autofill:focus, &:-webkit-autofill:hover': {
        boxShadow: `0 0 0px 1000px ${theme.color.blue100} inset`,
      },
    },
  },
})

export const textarea = style({
  ...mixins.textarea,
  resize: 'vertical',
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

export const labelSizes = styleMap(mixins.labelSizes)

export const labelDisabledEmptyInput = style(mixins.labelDisabledEmptyInput)

export const isRequiredStar = style({
  color: theme.color.red600,
})

export const hasFocus = style({
  selectors: {
    [`&${container}`]: mixins.containerFocus,
  },
})

export const icon = style({
  width: 24,
  height: 24,
  marginRight: 8,
  color: theme.color.red600,
  marginBottom: -3,
  ...themeUtils.responsiveStyle({
    md: {
      width: 32,
      height: 32,
      marginRight: 16,
    },
  }),
})
