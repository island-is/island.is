import { keyframes, style, styleVariants } from '@vanilla-extract/css'
import { Theme, theme, themeUtils } from '@island.is/island-ui/theme'
import * as inputMixins from '../Input/Input.mixins'
import omit from 'lodash/omit'
import mapValues from 'lodash/mapValues'

export const containerDisabled = style({
  opacity: 0.5,
  backgroundColor: 'transparent',
})

export const rightAlign = style({
  textAlign: 'right',
})

export const readOnly = style({
  backgroundColor: 'transparent',
})

export const noLabel = style({})

export const container = style({
  ...omit(inputMixins.container, 'backgroundColor'),
  boxSizing: 'border-box',
  selectors: {
    [`&:hover:not(${containerDisabled})`]: inputMixins.containerHover,
  },
})

export const containerSizes = styleVariants(inputMixins.containerSizes)

export const input = style({
  ...inputMixins.input,
  zIndex: 2,
  marginLeft: '120px',
  '::placeholder': inputMixins.inputPlaceholder,
  ':focus': inputMixins.inputFocus,
  selectors: {
    [`${noLabel} &::placeholder`]: {
      color: theme.color.dark400,
    },
  },
  ...themeUtils.responsiveStyle({
    xl: {
      marginLeft: '140px',
    },
  }),
})

export const inputDisabled = style({
  marginLeft: '110px',
  ...themeUtils.responsiveStyle({
    xl: {
      marginLeft: '110px',
    },
  }),
})

export const inputSize = styleVariants(inputMixins.inputSizes)
export const inputNoPaddingRight = style({
  paddingRight: 0,
})

const backgroundColorRules = {
  white: theme.color.white,
  blue: theme.color.blue100,
}

// To handle styling auto-fill states
const makeInputBackground = (breakpoint: keyof Theme['breakpoints']) =>
  styleVariants(
    mapValues(backgroundColorRules, (color) =>
      themeUtils.responsiveStyle({
        [breakpoint]: {
          selectors: {
            '&:-webkit-autofill, &:-webkit-autofill:focus, &:-webkit-autofill:hover':
              {
                boxShadow: `0 0 0px 1000px ${color} inset`,
              },
          },
        },
      }),
    ),
  )

export const inputBackgroundXs = makeInputBackground('xs')
export const inputBackgroundSm = makeInputBackground('sm')
export const inputBackgroundMd = makeInputBackground('md')
export const inputBackgroundLg = makeInputBackground('lg')
export const inputBackgroundXl = makeInputBackground('xl')

export const textarea = style({
  ...inputMixins.textarea,
  resize: 'vertical',
})

export const errorMessage = style(inputMixins.errorMessage)

export const hasError = style({
  ...inputMixins.inputErrorState,
  ...inputMixins.inputErrorStateWithBefore,
})

export const label = style({
  ...inputMixins.label,
  zIndex: 2,
  position: 'relative',
  selectors: {
    [`${hasError} &`]: inputMixins.labelErrorState,
    [`${readOnly} &`]: inputMixins.labelReadOnly,
  },
})

export const labelSizes = styleVariants(inputMixins.labelSizes)

export const labelDisabledEmptyInput = style(
  inputMixins.labelDisabledEmptyInput,
)

export const isRequiredStar = style({
  color: theme.color.red600,
})

export const menuOpen = style({
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
})

const focusStyles = {
  outline: 'none !important',
  boxShadow: `inset 0 0 0 3px ${theme.color.mint400} !important`,
}

export const hasFocus = style({
  selectors: {
    [`&${container}`]: focusStyles,
  },
})
export const fixedFocusState = style({
  selectors: {
    [`&${container}${container}`]: focusStyles,
  },
})

export const spinner = style({
  width: 24,
  height: 24,
  marginBottom: -3,
  border: `3px solid ${theme.color.blue200}`,
  borderBottomColor: theme.color.blue400,
  animationName: keyframes({
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(360deg)',
    },
  }),
  animationDuration: '1.5s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'linear',
})

export const icon = style({
  width: 24,
  height: 24,
  flexShrink: 0,
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

export const iconExtraSmall = style({
  ...themeUtils.responsiveStyle({
    md: {
      selectors: {
        [`${container}:not(${noLabel}) &`]: {
          width: 21,
          height: 21,
        },
      },
    },
  }),
})
