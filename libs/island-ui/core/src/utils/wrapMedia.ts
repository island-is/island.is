import { StyleRule } from '@vanilla-extract/css'
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
export const wrapMedia = (
  stylesObj: StyleRule = {},
  selector: string,
): StyleRule => {
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
