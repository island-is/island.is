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

export const multiValueContainer = style(
  {
    maxWidth: '100%',
  },
  'multiValueContainer',
)

export const multiValue = style(
  {
    backgroundColor: theme.color.blue200,
    color: theme.color.blue600,
    fontWeight: theme.typography.medium,
    borderRadius: theme.border.radius.large,
    overflow: 'hidden',
  },
  'multiValue',
)

export const multiValueLabel = style(
  {
    color: theme.color.blue600,
    fontWeight: theme.typography.medium,
    borderRadius: 0,
  },
  'multiValueLabel',
)

globalStyle(`${wrapper} .island-select__multi-value`, {
  borderRadius: theme.border.radius.large,
})

globalStyle(
  `${wrapper} .island-select__value-container--is-multi.island-select__value-container--has-value .island-select__input-container`,
  {
    width: 'auto',
  },
)

globalStyle(
  `${wrapper} .island-select__value-container.island-select__value-container--has-value`,
  {
    maxWidth: '100%',
  },
)

globalStyle(`${wrapper} .island-select__multi-value__label`, {
  borderRadius: 0,
  paddingLeft: '0.5rem',
  paddingBottom: '0.33rem',
  paddingTop: '0.33rem',
  paddingRight: 0,
  lineHeight: 1,
})

globalStyle(`${wrapper} .island-select__multi-value__remove`, {
  borderRadius: 0,
  paddingLeft: '0.25rem',
  paddingRight: '0.33rem',
  paddingBottom: '0.33rem',
  paddingTop: '0.33rem',
  transition: 'background .2s, color .2s',
  fontWeight: theme.typography.medium,
  cursor: 'pointer',
  flexShrink: 0,
})

globalStyle(`${wrapper} .island-select__multi-value__remove:hover`, {
  backgroundColor: theme.color.blue600,
  color: theme.color.white,
})

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
  `${wrapper} .island-select__control${container}${containerSizes.xs}`,
  {
    paddingRight: theme.spacing[2],
    minWidth: 100,
  },
)
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
  maxHeight: '336px',
})

export const option = style({
  selectors: {
    [`${wrapper} &.island-select__option`]: {
      display: 'flex',
      cursor: 'pointer',
      position: 'relative',
      fontWeight: theme.typography.light,
      transition: 'background .2s, color .2s',
      padding: '23px 24px',
    },
    [`${wrapper}${wrapperColor.blue} &`]: {
      background: theme.color.blue100,
    },
    [`${wrapper} .island-select__option&:not(:first-of-type)`]: {
      borderTop: `1px solid ${theme.color.blue200}`,
    },
  },
})

export const optionExtraSmall = style({
  selectors: {
    [`${wrapper} &.island-select__option`]: {
      display: 'flex',
      cursor: 'pointer',
      position: 'relative',
      fontWeight: theme.typography.light,
      transition: 'background .2s, color .2s',
      padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
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
      right: theme.spacing[2],
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
        zIndex: theme.zIndex.belowModal,
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

export const optionDescriptionTruncated = style({
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
})

export const optionSizes = styleVariants({
  xs: wrapMedia(inputMixins.inputSizes.xs, `${wrapper} &`),
  sm: wrapMedia(inputMixins.inputSizes.sm, `${wrapper} &`),
  md: wrapMedia(inputMixins.inputSizes.sm, `${wrapper} &`),
})

export const optionDescriptionSizes = styleVariants({
  xs: wrapMedia(inputMixins.optionDescriptionSizes.xs, `${wrapper} &`),
  sm: wrapMedia(inputMixins.optionDescriptionSizes.sm, `${wrapper} &`),
  md: wrapMedia(inputMixins.optionDescriptionSizes.sm, `${wrapper} &`),
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

export const inputCheckbox = style({
  height: theme.spacing[3],
  left: 0,
  opacity: 0,
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  width: theme.spacing[3],
  cursor: 'pointer',
})

export const checkbox = style({
  alignItems: 'center',
  alignSelf: 'center',
  backgroundColor: theme.color.white,
  border: `1px solid ${theme.color.blue200}`,
  borderRadius: theme.border.radius.standard,
  display: 'flex',
  flexShrink: 0,
  height: theme.spacing[3],
  justifyContent: 'center',
  marginRight: theme.spacing[2],
  transition: 'border-color .1s, shadow .1s, background-color .1s',
  width: theme.spacing[3],
})

export const checkboxChecked = style({
  selectors: {
    [`&${checkbox}`]: {
      backgroundColor: theme.color.blue400,
      borderColor: theme.color.blue400,
    },
  },
})
