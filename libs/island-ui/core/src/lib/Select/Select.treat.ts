import { style, globalStyle } from 'treat'
import { theme } from '../../theme'
import * as inputMixins from '../Input/Input.mixins'

export const wrapper = style({}, 'wrapper')

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

globalStyle(`${wrapper} ${valueContainer} .css-b8ldur-Input`, {
  margin: 0,
  padding: 0,
})

export const placeholder = style(
  {
    selectors: {
      [`${wrapper} &`]: {
        marginLeft: 0,
        ...inputMixins.placeholder,
      },
    },
  },
  'placeholder',
)

export const input = style(inputMixins.input, 'input')

globalStyle(`${wrapper} ${input} input`, inputMixins.input)
globalStyle(`${wrapper} ${input} input:focus`, inputMixins.inputFocus)

export const errorMessage = style(inputMixins.errorMessage)
export const hasError = style({})

export const containerDisabled = style({})
export const container = style({}, 'container')
globalStyle(`${wrapper} .island-select__control${container}`, {
  ...inputMixins.container,
  transition: 'border-color 0.1s',
})
globalStyle(
  `${wrapper} .island-select__control${container}${hasError}`,
  inputMixins.inputErrorState,
)
globalStyle(
  `${wrapper} .island-select__control${container}${containerDisabled}`,
  inputMixins.containerDisabled,
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

export const label = style({
  ...inputMixins.label,
  selectors: {
    [`${hasError} &`]: inputMixins.labelErrorState,
  },
})
export const singleValue = style(
  {
    marginLeft: 0,
    ...inputMixins.input,
  },
  'singleValue',
)
export const indicatorsContainer = style(
  {
    selectors: {
      [`${wrapper} &`]: {
        height: '100%',
        position: 'absolute',
        right: 32,
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  },
  'indicatorsContainer',
)
export const dropdownIndicator = style(
  {
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
        marginTop: -1,
        boxShadow: `0 0 0 4px ${theme.color.mint400}`,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      },
      [`${wrapper} &:before `]: {
        content: '""',
        position: 'absolute',
        top: -4,
        left: 0,
        right: 0,
        height: 4,
        width: '100%',
        backgroundColor: theme.color.white,
        borderBottom: `1px solid ${theme.color.blue200}`,
      },
    },
  },
  'menu',
)
export const option = style(
  {
    selectors: {
      [`${wrapper} &`]: {
        position: 'relative',
        fontSize: 24,
        fontWeight: theme.typography.light,
        padding: '23px 24px',
      },
    },
  },
  'option',
)

globalStyle(`${wrapper} ${option}.island-select__option--is-focused`, {
  backgroundColor: theme.color.blue100,
})

globalStyle(`${wrapper} ${option}.island-select__option--is-selected`, {
  fontWeight: theme.typography.medium,
  color: theme.color.dark400,
})

globalStyle(
  `${wrapper} ${option}.island-select__option--is-selected:not(.island-select__option--is-focused)`,
  {
    backgroundColor: theme.color.white,
  },
)

globalStyle(`${wrapper} ${option}.island-select__option--is-focused:before`, {
  content: '""',
  height: 1,
  backgroundColor: theme.color.white,
  position: 'absolute',
  top: -1,
  right: 20,
  left: 20,
})

globalStyle(
  `${wrapper} ${option}:not(:last-of-type):not(.island-select__option--is-focused):after`,
  {
    content: '""',
    height: 1,
    backgroundColor: theme.color.blue200,
    position: 'absolute',
    bottom: 0,
    right: 20,
    left: 20,
  },
)
