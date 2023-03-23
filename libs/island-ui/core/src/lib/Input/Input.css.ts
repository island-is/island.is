import { keyframes, style, styleVariants } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { Theme, theme, themeUtils } from '@island.is/island-ui/theme'
import * as mixins from './Input.mixins'
import omit from 'lodash/omit'
import mapValues from 'lodash/mapValues'

// export const containerDisabled = style({
//   opacity: 0.5,
//   backgroundColor: 'transparent',
// })

// export const rightAlign = style({
//   textAlign: 'right',
// })

// export const readOnly = style({
//   backgroundColor: 'transparent',
// })

// export const noLabel = style({})

// export const container = style({
//   ...omit(mixins.container, 'backgroundColor'),
//   boxSizing: 'border-box',
//   selectors: {
//     [`&:hover:not(${containerDisabled})`]: mixins.containerHover,
//   },
// })
export const container = recipe({
  base: {
    ...omit(mixins.container, 'backgroundColor'),
    boxSizing: 'border-box',
    display: 'flex',
    alignContent: 'center',
    overflow: 'hidden',
  },
  variants: {
    disabled: {
      true: {
        backgroundColor: 'transparent',
      },
      false: {},
    },
    readOnly: {
      true: {
        backgroundColor: 'transparent',
      },
    },
    hasError: {
      true: mixins.inputErrorState,
    },
    hasFocus: {
      true: mixins.containerFocus,
      false: {},
    },
  },
  compoundVariants: [
    {
      variants: {
        disabled: false,
        hasFocus: false,
      },
      style: {
        ':hover': {
          ...mixins.containerHover,
        },
      },
    },
  ],
})

// export const hasFocus = style({
//   selectors: {
//     [`&${container}`]: mixins.containerFocus,
//   },
// })
// export const fixedFocusState = style({
//   selectors: {
//     [`&${container}${container}`]: mixins.containerFocus,
//   },
// })

export const containerSizes = styleVariants(mixins.containerSizes)

// export const input = style({
//   ...mixins.input,
//   '::placeholder': mixins.inputPlaceholder,
//   ':focus': mixins.inputFocus,
//   selectors: {
//     [`${noLabel} &::placeholder`]: {
//       color: theme.color.dark400,
//     },
//   },
// })
export const input = recipe({
  base: {
    ...mixins.input,
    '::placeholder': mixins.inputPlaceholder,
    ':focus': mixins.inputFocus,
  },

  variants: {
    hasLabel: {
      false: {
        color: theme.color.dark400,
      },
    },
    rightAlign: {
      true: {
        textAlign: 'right',
      },
    },
    textarea: {
      true: {
        ...mixins.textarea,
        resize: 'vertical',
      },
    },
  },
  // selectors: {
  //   [`${noLabel} &::placeholder`]: {
  //   },
  // },
})

export const inputSize = styleVariants(mixins.inputSizes)

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
            '&:-webkit-autofill, &:-webkit-autofill:focus, &:-webkit-autofill:hover': {
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

// export const textarea = style({
//   ...mixins.textarea,
//   resize: 'vertical',
// })

export const errorMessage = style(mixins.errorMessage)

// export const hasError = style({
//   ...mixins.inputErrorState,
// })

export const label = recipe({
  base: {
    ...mixins.label,
  },
  variants: {
    readOnly: {
      true: mixins.labelReadOnly,
    },
    hasError: {
      true: mixins.labelErrorState,
    },
    disabledEmptyInput: {
      true: mixins.labelDisabledEmptyInput,
    },
  },
})

export const labelSizes = styleVariants(mixins.labelSizes)

// export const labelDisabledEmptyInput = style(mixins.labelDisabledEmptyInput)

export const isRequiredStar = style({
  color: theme.color.red600,
})

// export const hasFocus = style({
//   selectors: {
//     [`&${container}`]: mixins.containerFocus,
//   },
// })
// export const fixedFocusState = style({
//   selectors: {
//     [`&${container}${container}`]: mixins.containerFocus,
//   },
// })

export const aside = style({
  display: 'flex',
  alignSelf: 'stretch',
  padding: 1,
  borderRadius: `0 11px 11px 0`,
  overflow: 'hidden',
})

export const inputButton = recipe({
  base: {
    backgroundColor: 'transparent',
    borderLeft: `1px solid ${theme.color.blue200}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    transition: 'background-color 0.1s ease',

    ':hover': {
      backgroundColor: theme.color.blue200,
    },

    ':focus': {
      outline: 'none',
      backgroundColor: theme.color.mint200,
    },

    ':disabled': {
      backgroundColor: theme.color.blue100,
    },
  },
  variants: {
    size: {
      xs: {
        width: 48,
      },
      sm: {
        width: 64,
      },
      md: {
        width: 78,
      },
    },
    hasError: {
      true: {
        borderLeftColor: theme.color.red600,
      },
    },
  },
})

export const iconWrapper = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  variants: {
    size: {
      xs: {
        width: 36,
      },
      sm: {
        width: 44,
      },
      md: {
        width: 58,
      },
    },
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

export const icon = recipe({
  base: {
    flexShrink: 0,
    color: theme.color.blue400,

    selectors: {
      [`${inputButton()}:focus &`]: {
        color: theme.color.dark400,
      },
      [`${inputButton()}:disabled &`]: {
        color: theme.color.blue200,
      },
    },
  },

  variants: {
    hasError: {
      true: {
        color: theme.color.red600,
      },
    },
    size: {
      xs: {
        width: 21,
        height: 21,
      },
      sm: {
        width: 21,
        height: 21,
      },
      md: {
        width: 28,
        height: 28,
      },
    },
    hasLabel: {
      false: {
        ...themeUtils.responsiveStyle({
          md: {
            marginBottom: 0,
          },
        }),
      },
    },
  },
})

// export const iconError = style({})

// export const iconExtraSmall = style({
//   ...themeUtils.responsiveStyle({
//     md: {
//       selectors: {
//         [`${container}:not(${noLabel}) &`]: {
//           width: 21,
//           height: 21,
//         },
//       },
//     },
//   }),
// })
