// Based on libs/island-ui/core/src/lib/Input/Input.treat.ts
import { style } from '@vanilla-extract/css'
import { theme, helperStyles } from '@island.is/island-ui/theme'
import * as mixins from './EditorInput.mixins'
import omit from 'lodash/omit'

export const containerDisabled = style({
  opacity: 0.5,
  backgroundColor: 'transparent',
})

export const isImpact = style({})

export const readOnly = style({
  backgroundColor: 'transparent',
})

export const srOnly = helperStyles.srOnly

export const container = style({
  ...omit(mixins.container, 'backgroundColor'),
  cursor: 'auto',
  boxSizing: 'border-box',
  selectors: {
    [`&:hover:not(${containerDisabled})`]: mixins.containerHover,
  },
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

export const isRequiredStar = style({
  color: theme.color.red600,
})

export const hasFocus = style({
  position: 'relative',
  zIndex: 4,

  selectors: {
    [`&${container}`]: mixins.containerFocus,
  },
})
