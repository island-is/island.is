import { style, styleMap } from 'treat'
import { Theme, theme, themeUtils } from '@island.is/island-ui/theme'
import * as mixins from './Input.mixins'
import { mapToStyleProperty } from '../../utils/mapToStyleProperty'
import { mapValues } from 'lodash'

export const containerDisabled = style({})
export const noLabel = style({})

export const container = style({
  ...mixins.container,
  boxSizing: 'border-box',
  selectors: {
    [`&:hover:not(${containerDisabled})`]: mixins.containerHover,
    [`&${containerDisabled}`]: mixins.containerDisabled,
  },
})

export const containerSizes = styleMap(mixins.containerSizes)

const backgroundColorRules = {
  white: theme.color.white,
  blue: theme.color.blue100
} as const

const makeContainerBackground = (breakpoint: keyof Theme['breakpoints']) =>
  styleMap(
    mapValues(backgroundColorRules, (color) => 
      themeUtils.responsiveStyle({ [breakpoint]: { backgroundColor: color } })
    )
  )

export const containerBackgroundXs = makeContainerBackground('xs')
export const containerBackgroundSm = makeContainerBackground('sm')
export const containerBackgroundMd = makeContainerBackground('md')
export const containerBackgroundLg = makeContainerBackground('lg')
export const containerBackgroundXl = makeContainerBackground('xl')

export const input = style({
  ...mixins.input,
  '::placeholder': mixins.inputPlaceholder,
  ':focus': mixins.inputFocus,
  ':disabled': mixins.inputDisabled,
  selectors: {
    [`${noLabel} &::placeholder`]: {
      color: theme.color.dark400,
    },
  },
})

export const inputSize = styleMap(mixins.inputSizes)

const makeInputBackground = (breakpoint: keyof Theme['breakpoints']) => 
  styleMap(
    mapValues(backgroundColorRules, (color) => 
      themeUtils.responsiveStyle({ 
        [breakpoint]: { 
          selectors: {
            '&:-webkit-autofill, &:-webkit-autofill:focus, &:-webkit-autofill:hover': {
              boxShadow: `0 0 0px 1000px ${color} inset`,
            }
          }
        }
      })
    )
  )

export const inputBackgroundXs = makeInputBackground('xs')
export const inputBackgroundSm = makeInputBackground('sm')
export const inputBackgroundMd = makeInputBackground('md')
export const inputBackgroundLg = makeInputBackground('lg')
export const inputBackgroundXl = makeInputBackground('xl')

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
export const fixedFocusState = style({
  selectors: {
    [`&${container}${container}`]: mixins.containerFocus,
  },
})

export const icon = style({
  width: 24,
  height: 24,
  marginBottom: -3,
  color: theme.color.blue400,
  ...themeUtils.responsiveStyle({
    md: {
      selectors: {
        [`${container}:not(${noLabel}) &`]: {
          width: 32,
          height: 32,
        },
        [`${container}${noLabel} &`]: {
          marginBottom: 0,
        },
      },
    },
  }),
})

export const iconError = style({
  color: theme.color.red600,
})
