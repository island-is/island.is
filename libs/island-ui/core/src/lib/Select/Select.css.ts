import {
  style,
  globalStyle,
  styleVariants,
  StyleRule,
} from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'
import * as inputMixins from '../Input/Input.mixins'
import merge from 'lodash/merge'

/**
 * Media does not work under the selector key, this function moves the selector under the media key
 * ex.
 * wrapMedia({
 *  '@media': {
 *    [mediaSelector]: {
 *      padding: 0
 *    }
 *  }
 * }, '.react-select &')
 * output:
 * {
 *  '@media': {
 *    [mediaSelector]: {
 *      selectors: {
 *        ['.react-select &']: {
 *          padding: 0
 *        }
 *      }
 *    }
 *  }
 * }
 * @param stylesObj
 * @param selector
 */
const wrapMedia = (stylesObj: StyleRule = {}, selector: string): StyleRule => {
  const keys = Object.keys(stylesObj) as (keyof typeof stylesObj)[]
  const initialValue: StyleRule = { selectors: {} }
  return keys.reduce((acc, key) => {
    if (key === '@media') {
      const mediaObj: {
        [query: string]: StyleRule
      } = stylesObj['@media'] || {}
      const mediaKeys = Object.keys(mediaObj)
      const initialValue: {
        [query: string]: StyleRule
      } = {}
      const media = mediaKeys.reduce((mediaAcc = {}, mediaKey) => {
        if (!mediaAcc[mediaKey]) {
          mediaAcc[mediaKey] = {
            selectors: {},
          }
        }
        mediaAcc[mediaKey].selectors![selector] = mediaObj[mediaKey]
        return mediaAcc
      }, initialValue)
      if (!acc['@media']) {
        acc['@media'] = media
      } else {
        acc['@media'] = merge(media, acc['@media'])
      }
    } else if (key === 'selectors' && typeof acc.selectors === 'object') {
      acc.selectors = { ...acc.selectors, ...stylesObj.selectors }
    } else {
      acc.selectors![selector] = {
        ...acc.selectors![selector],
        [key]: stylesObj[key],
      }
    }
    return acc
  }, initialValue)
}

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

globalStyle(`${wrapper} ${valueContainer} .css-b8ldur-Input`, {
  margin: 0,
  padding: 0,
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

export const input = style(inputMixins.input, 'input')
export const inputSize = styleVariants(
  {
    sm: wrapMedia(inputMixins.inputSizes.sm, `${wrapper} &`),
    md: wrapMedia(inputMixins.inputSizes.md, `${wrapper} &`),
  },
  'inputSizes',
)

globalStyle(`${wrapper} ${input} input`, inputMixins.input)
globalStyle(`${wrapper} ${inputSize.sm} input`, inputMixins.inputSizes.sm)
globalStyle(`${wrapper} ${inputSize.md} input`, inputMixins.inputSizes.md)

globalStyle(`${wrapper} ${input} input:focus`, inputMixins.inputFocus)

export const errorMessage = style(inputMixins.errorMessage)
export const hasError = style({})

export const containerDisabled = style({})
export const container = style({}, 'container')
export const containerSizes = styleVariants(inputMixins.containerSizes)

globalStyle(`${wrapper} .css-1uccc91-singleValue`, {
  color: theme.color.dark400,
})
globalStyle(`${wrapper} .css-1g6gooi`, {
  padding: 0,
  margin: 0,
})
globalStyle(`${wrapper} .island-select__control${container}`, {
  ...inputMixins.container,
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
  width: 24,
  height: 24,
  ...themeUtils.responsiveStyle({
    md: {
      width: 32,
      height: 32,
    },
  }),
})
export const label = style({
  ...inputMixins.label,
  selectors: {
    [`${hasError} &`]: inputMixins.labelErrorState,
  },
})
export const labelSizes = styleVariants({
  sm: inputMixins.labelSizes.sm,
  md: inputMixins.labelSizes.md,
})
export const singleValue = style(
  {
    marginLeft: 0,
    marginRight: 0,
    paddingRight: 0,
    ...inputMixins.input,
  },
  'singleValue',
)
export const singleValueSizes = styleVariants(
  {
    sm: wrapMedia(inputMixins.inputSizes.sm, `${wrapper} &`),
    md: wrapMedia(inputMixins.inputSizes.md, `${wrapper} &`),
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
        transition: 'transform .2s',
      },
    },
  },
  'indicatorsContainer',
)
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

export const optionSizes = styleVariants({
  sm: wrapMedia(inputMixins.inputSizes.sm, `${wrapper} &`),
  md: wrapMedia(inputMixins.inputSizes.md, `${wrapper} &`),
})

globalStyle(
  `${wrapper} .island-select__control${container}.island-select__control--menu-is-open ${indicatorsContainer}`,
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
