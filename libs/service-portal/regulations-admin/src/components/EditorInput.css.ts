// Based on libs/island-ui/core/src/lib/Input/Input.treat.ts
import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'
import * as mixins from './EditorInput.mixins'
import omit from 'lodash/omit'

export const containerDisabled = style({})
export const noLabel = style({})

export const container = style({
  ...omit(mixins.container, 'backgroundColor'),
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

export const description = style({
  // …
})

export const isRequiredStar = style({
  color: theme.color.red600,
})

export const hasFocus = style({
  selectors: {
    [`&${container}`]: mixins.containerFocus,
  },
})
