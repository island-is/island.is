import { style, globalStyle, styleVariants } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'
import * as inputMixins from '../Input/Input.mixins'
import { wrapMedia } from '../../utils/wrapMedia'

export const wrapper = style({}, 'wrapper')
export const wrapperColor = styleVariants(
  { blue: {}, white: {} },
  'wrapperColor',
)
export const valueContainer = style(
  {
    selectors: {
      [`${wrapper} &`]: {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        marginLeft: 0,
      },
    },
  },
  'valueContainer',
)

globalStyle(`${wrapper} ${valueContainer} .island-select__input-container`, {
  margin: 0,
})

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
    padding: 0,
    margin: 0,
  },
  'input-container',
)

export const input = style(
  {
    ...inputMixins.input,
    ':focus': inputMixins.inputFocus,
    ...themeUtils.responsiveStyle({
      xs: inputMixins.inputSizes.xs,
      sm: inputMixins.inputSizes.sm,
      md: inputMixins.inputSizes.md,
    }),
  },
  'input',
)

export const errorMessage = style(inputMixins.errorMessage)
export const hasError = style({})

export const containerDisabled = style({
  backgroundColor: 'transparent',
})
export const container = style({}, 'container')
export const containerSizes = styleVariants(inputMixins.containerSizes)

globalStyle(`${wrapper} .css-1g6gooi`, {
  padding: 0,
  margin: 0,
})
globalStyle(`${wrapper} .island-select__control${container}`, {
  ...inputMixins.container,
  flexDirection: 'column',
  alignItems: 'flex-start',
  paddingRight: 70,
  border: 0,
})
globalStyle(
  `${wrapper}${wrapperColor.blue} .island-select__control${container}`,
  {
    background: theme.color.blue100,
  },
)

globalStyle(
  `${wrapper} .island-select__control${container}${hasError}`,
  inputMixins.inputErrorState,
)
globalStyle(
  `${wrapper} .island-select__control${container}:hover:not(.island-select__control--is-focused):not(${containerDisabled})`,
  inputMixins.containerHover,
)
globalStyle(
  `${wrapper} .island-select__control${container}.island-select__control--is-focused`,
  inputMixins.containerFocus,
)
globalStyle(
  `${wrapper} .island-select__control${container}.island-select__control--menu-is-open`,
  {
    borderColor: 'transparent',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
)

globalStyle(`${wrapper}  .island-select__menu-list`, {
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
export const labelSizes = styleVariants(inputMixins.labelSizes)
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
        right: theme.spacing[4],
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

export const indicatorsContainerExtraSmall = style({
  selectors: {
    [`${wrapper} &`]: {
      right: 20,
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
    selectors: {
      [`${wrapper} &`]: {
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
      },
    },
  },
  'menu',
)

export const option = style({
  selectors: {
    [`${wrapper} &.island-select__option`]: {
      cursor: 'pointer',
      position: 'relative',
      fontWeight: theme.typography.light,
      padding: '23px 24px',
      transition: 'background .2s, color .2s',
    },
    [`${wrapper}${wrapperColor.blue} &`]: {
      background: theme.color.blue100,
    },
    [`${wrapper} .island-select__option&:not(:first-of-type)`]: {
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
  `${wrapper} .island-select__control${container}.island-select__control--menu-is-open ${indicatorsContainer}:not(${dontRotateIconOnOpen})`,
  {
    transform: 'rotateX(180deg)',
  },
)

globalStyle(
  `${wrapper}${wrapperColor.blue} .island-select__option--is-focused`,
  {
    backgroundColor: theme.color.white,
  },
)
globalStyle(
  `${wrapper}${wrapperColor.white} .island-select__option--is-focused`,
  {
    backgroundColor: theme.color.blue100,
  },
)

globalStyle(`${wrapper} .island-select__option--is-selected`, {
  fontWeight: theme.typography.medium,
  color: theme.color.dark400,
})

globalStyle(
  `${wrapper} .island-select__option--is-selected:not(.island-select__option--is-focused)`,
  {
    backgroundColor: theme.color.white,
  },
)

export const isRequiredStar = style({
  color: theme.color.red600,
})
