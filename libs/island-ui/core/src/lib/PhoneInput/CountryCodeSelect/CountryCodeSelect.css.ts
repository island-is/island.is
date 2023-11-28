import { style, globalStyle, styleVariants } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'
import { recipe } from '@vanilla-extract/recipes'
import * as inputMixins from '../../Input/Input.mixins'
import { wrapMedia } from '../../../utils/wrapMedia'

export const wrapper = style({}, 'wrapper')
export const wrapperColor = styleVariants(
  { blue: {}, white: {} },
  'wrapperColor',
)
export const valueContainer = recipe(
  {
    base: {
      paddingTop: theme.spacing[4],
      paddingBottom: theme.spacing[2],
      paddingLeft: 0,
      marginLeft: 0,
    },
    variants: {
      size: {
        xs: {
          paddingTop: 28,
          ...themeUtils.responsiveStyle({
            md: {
              paddingTop: theme.spacing[4],
            },
          }),
        },
        sm: {},
        md: {},
      },
    },
  },
  'valueContainer',
)

export const valueContainerSmall = style({
  paddingTop: theme.spacing[3],
  ...themeUtils.responsiveStyle({
    md: {
      paddingTop: theme.spacing[3] + theme.spacing[1] / 2,
    },
  }),
})

export const optionFlag = style(
  {
    paddingRight: theme.spacing[3],
    fontSize: 32,
  },
  'option-flag',
)

export const placeholder = style({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  selectors: {
    [`${wrapper} &`]: { ...inputMixins.placeholder },
  },
})
export const placeholderPadding = style({
  selectors: {
    [`${wrapper} &`]: {
      padding: inputMixins.input.padding,
    },
  },
  ...wrapMedia({ '@media': inputMixins.input['@media'] }, `${wrapper} &`),
})
export const placeholderSizes = styleVariants(inputMixins.inputSizes)

export const inputContainer = style(
  {
    ...inputMixins.input,
    margin: 0,
    padding: 0,
  },
  'input-container',
)

export const input = style(
  {
    ...inputMixins.input,
    ':focus': inputMixins.inputFocus,
    ...themeUtils.responsiveStyle(inputMixins.inputSizes),
  },
  'input',
)

export const errorMessage = style(inputMixins.errorMessage)
export const hasError = style({})

export const containerDisabled = style({
  backgroundColor: 'transparent',
})
export const container = style(
  {
    height: '100%',
    ':before': {
      content: '',
      position: 'absolute',
      top: 1,
      right: 0,
      width: 1,
      bottom: 1,
      backgroundColor: theme.color.blue200,
    },
  },
  'container',
)

export const containerXS = style(
  {
    ':before': {
      top: theme.spacing[3],
    },
  },
  'container',
)

export const containerSizes = styleVariants(inputMixins.containerSizes)

globalStyle(`${wrapper} .country-code-select__control${container}`, {
  ...inputMixins.container,
  backgroundColor: 'transparent',
  boxShadow: 'inset 0 0 0 1px transparent',
  width: '120px',
  borderBottomRightRadius: 0,
  borderTopRightRadius: 0,
  border: 0,
  ...themeUtils.responsiveStyle({
    xl: {
      width: '140px',
    },
  }),
})
globalStyle(
  `${wrapper} .country-code-select__control--is-disabled${container}`,
  {
    width: '110px',
    ...themeUtils.responsiveStyle({
      xl: {
        width: '110px',
      },
    }),
  },
)
globalStyle(`${wrapper} .country-code-select__control${containerXS}`, {
  width: '120px',
})

globalStyle(
  `${wrapper}${wrapperColor.blue} .country-code-select__control${container}`,
  {
    background: 'transparent',
  },
)

globalStyle(
  `${wrapper} .country-code-select__control${container}${hasError}`,
  inputMixins.inputErrorState,
)

globalStyle(
  `${wrapper} .country-code-select__control${container}.country-code-select__control--menu-is-open`,
  {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
)

globalStyle(`${wrapper}  .country-code-select__menu-list`, {
  padding: 0,
})

export const icon = style({
  width: theme.spacing[3],
  height: theme.spacing[3],
  ...themeUtils.responsiveStyle({
    md: {
      width: theme.spacing[4],
      height: theme.spacing[4],
    },
  }),
})

export const iconExtraSmall = style({
  ...themeUtils.responsiveStyle({
    md: {
      width: theme.spacing[3],
      height: theme.spacing[3],
    },
  }),
})

export const label = style({
  ...inputMixins.label,
  selectors: {
    [`${hasError} &`]: inputMixins.labelErrorState,
  },
})
export const labelDisabled = style({
  opacity: 0.5,
})
export const labelSizes = styleVariants({
  xs: inputMixins.labelSizes.xs,
  sm: inputMixins.labelSizes.sm,
  md: inputMixins.labelSizes.md,
})
export const singleValue = style(
  {
    marginLeft: 0,
    marginRight: 0,
    paddingRight: 0,
    ...inputMixins.input,
    color: theme.color.dark400,
  },
  'singleValue',
)

export const singleValueSizes = styleVariants(
  {
    xs: wrapMedia(inputMixins.inputSizes.xs, `${wrapper} &`),
    sm: wrapMedia(inputMixins.inputSizes.sm, `${wrapper} &`),
    md: wrapMedia(inputMixins.inputSizes.md, `${wrapper} &`),
  },
  'singleValue',
)
export const indicatorsContainer = style(
  {
    cursor: 'pointer',
    selectors: {
      [`${wrapper} &`]: {
        height: '100%',
        position: 'absolute',
        right: theme.spacing[2],
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform .2s',
      },
    },
  },
  'indicatorsContainer',
)

export const indicatorsContainerDisabled = style(
  {
    pointerEvents: 'none',
    selectors: {
      [`${wrapper} &`]: {
        display: 'none',
      },
    },
  },
  'indicatorsContainer',
)

export const indicatorContainerWithLabel = style(
  {
    selectors: {
      [`${wrapper} &`]: {
        top: theme.spacing[1],
      },
    },
  },
  'indicatorsContainer',
)

export const indicatorsContainerExtraSmall = style({
  selectors: {
    [`${wrapper} &`]: {
      top: 12,
      right: 12,
    },
  },
})

export const dropdownIndicator = style(
  {
    cursor: 'pointer',
    selectors: {
      [`${wrapper} &`]: {
        padding: 0,
      },
    },
  },
  'dropdownIndicator',
)
export const menu = style(
  {
    marginTop: -3,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    boxShadow: 'none',
    borderTop: `1px solid ${theme.color.blue200}`,
    borderRight: `3px solid ${theme.color.mint400}`,
    borderLeft: `3px solid ${theme.color.mint400}`,
    borderBottom: `3px solid ${theme.color.mint400}`,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    boxSizing: 'border-box',
    backgroundColor: theme.color.white,
  },
  'menu',
)

export const option = style({
  selectors: {
    [`${wrapper} &.country-code-select__option`]: {
      cursor: 'pointer',
      position: 'relative',
      fontWeight: theme.typography.light,
      padding: '23px 24px',
      transition: 'background .2s, color .2s',
    },
    [`${wrapper}${wrapperColor.blue} &`]: {
      background: theme.color.blue100,
    },
    [`${wrapper} .country-code-select__option&:not(:first-of-type)`]: {
      borderTop: `1px solid ${theme.color.blue200}`,
    },
  },
})

export const optionDescription = style({
  paddingTop: theme.spacing[1],
})

export const optionDescriptionTruncated = style({
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
})

export const optionSizes = styleVariants({
  xs: wrapMedia(inputMixins.inputSizes.xs, `${wrapper} &`),
  sm: wrapMedia(inputMixins.inputSizes.sm, `${wrapper} &`),
  md: wrapMedia(inputMixins.inputSizes.md, `${wrapper} &`),
})

export const optionDescriptionSizes = styleVariants({
  xs: wrapMedia(inputMixins.optionDescriptionSizes.xs, `${wrapper} &`),
  sm: wrapMedia(inputMixins.optionDescriptionSizes.sm, `${wrapper} &`),
  md: wrapMedia(inputMixins.optionDescriptionSizes.md, `${wrapper} &`),
})

export const dontRotateIconOnOpen = style({})

globalStyle(
  `${wrapper} .country-code-select__control${container}.country-code-select__control--menu-is-open ${indicatorsContainer}:not(${dontRotateIconOnOpen})`,
  {
    transform: 'rotateX(180deg)',
  },
)

globalStyle(
  `${wrapper}${wrapperColor.blue} .country-code-select__option--is-focused`,
  {
    backgroundColor: theme.color.white,
  },
)
globalStyle(
  `${wrapper}${wrapperColor.white} .country-code-select__option--is-focused`,
  {
    backgroundColor: theme.color.blue100,
  },
)

globalStyle(`${wrapper} .country-code-select__option--is-selected`, {
  fontWeight: theme.typography.medium,
  color: theme.color.dark400,
})

globalStyle(
  `${wrapper} .country-code-select__option--is-selected:not(.country-code-select__option--is-focused)`,
  {
    backgroundColor: theme.color.white,
  },
)

globalStyle(`${wrapper} .country-code-select__single-value--is-disabled`, {
  color: theme.color.dark400,
})

globalStyle(`${wrapper} .country-code-select__control--is-disabled`, {
  opacity: 1,
})

export const isRequiredStar = style({
  color: theme.color.red600,
})
