import { keyframes, style, styleVariants } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { Theme, theme, themeUtils } from '@island.is/island-ui/theme'
import * as mixins from './Input.mixins'
import mapValues from 'lodash/mapValues'

export const container = recipe({
  base: {
    ...mixins.containerWithBefore,
    boxSizing: 'border-box',
    display: 'flex',
    alignContent: 'center',
    position: 'relative',
    zIndex: 0,
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
      true: {
        ...mixins.inputErrorStateWithBefore,
      },
      false: {},
    },
    hasFocus: {
      true: {
        ...mixins.containerFocusWithBefore,
      },
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
        selectors: {
          '&:hover::before': {
            boxShadow: `inset 0 0 0 1px ${theme.color.blue400}`,
          },
        },
      },
    },
  ],
})

export const containerSizes = styleVariants(mixins.containerSizes)

export const input = recipe({
  base: {
    ...mixins.input,
    '::placeholder': mixins.inputPlaceholder,
    ':focus': mixins.inputFocus,
    selectors: {
      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
        margin: 0,
        WebkitAppearance: 'none',
      },
      '&[type=number]': {
        MozAppearance: 'textfield',
      },
    },
  },

  variants: {
    disabled: {
      true: {
        color: theme.color.dark300,
      },
    },
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
    oneDigit: {
      true: {
        padding: theme.spacing[2],
        textAlign: 'center',
        height: 64,
        width: 56,
      },
      false: {
        padding: mixins.mobileInputPadding,
        ...themeUtils.responsiveStyle({
          md: {
            padding: mixins.inputPadding,
          },
        }),
      },
    },
    noCaret: {
      true: {
        caretColor: 'transparent',
      },
    },
  },
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

export const errorMessage = style(mixins.errorMessage)

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
    disabled: {
      true: mixins.labelDisabledEmptyInput,
    },
  },
})

export const labelSizes = styleVariants(mixins.labelSizes)

export const isRequiredStar = style({
  color: theme.color.red600,
})

export const aside = style({
  display: 'flex',
  alignSelf: 'stretch',
  alignItems: 'center',
  justifyContent: 'flex-end',
})

export const inputButton = recipe({
  base: {
    backgroundColor: 'transparent',
    borderLeft: `1px solid ${theme.color.blue200}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color .25s',
    borderTop: `transparent`,
    borderRight: `transparent`,
    borderBottom: `transparent`,
    position: 'relative',
    height: '100%',

    ':hover': {
      backgroundColor: theme.color.blue200,
    },
    ':active': {
      backgroundColor: theme.color.blue200,
    },

    ':focus-visible': {
      outline: 'none',
      backgroundColor: theme.color.mint200,
    },

    ':disabled': {
      cursor: 'default',
      backgroundColor: theme.color.blue100,
    },
  },
  variants: {
    size: {
      xs: {
        ...themeUtils.responsiveStyle({
          xs: {
            width: 40,
          },
          md: {
            width: 48,
          },
        }),
      },
      sm: {
        ...themeUtils.responsiveStyle({
          xs: {
            width: 60,
          },
          md: {
            width: 64,
          },
        }),
      },
      md: {
        ...themeUtils.responsiveStyle({
          xs: {
            width: 72,
          },
          md: {
            width: 78,
          },
        }),
      },
    },
    hasError: {
      true: {
        borderLeftColor: theme.color.red600,

        ':disabled': {
          backgroundColor: theme.color.red100,
        },
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
        width: 52,
      },
    },
  },
})

export const spinner = style({
  width: 24,
  height: 24,
  marginRight: 12,
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
    zIndex: 1,

    selectors: {
      [`${inputButton()}:focus-visible &`]: {
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
        selectors: {
          [`${inputButton()}:disabled &`]: {
            color: theme.color.red200,
          },
        },
      },
    },
    size: {
      xs: {
        width: 21,
        height: 21,
      },
      sm: {
        width: 24,
        height: 24,
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
