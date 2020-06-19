import { style } from 'treat'
import { isObject } from 'lodash'
import { theme } from '../theme'

export const resolveBreakpoints = (variant, attr, acc) => {
  if (isObject(variant[attr])) {
    Object.keys(variant[attr]).reduce((acc, breakpointKey) => {
      const handleBreakpoint = Object.prototype.hasOwnProperty.call(
        theme.breakpoints,
        breakpointKey,
      )

      if (!handleBreakpoint) {
        acc[attr] = variant[attr]
        return acc
      }

      if (breakpointKey === 'xs') {
        acc[attr] = variant[attr].xs
      } else {
        if (!acc['@media']) {
          acc['@media'] = {}
        }
        if (
          !acc['@media'][`(min-width: ${theme.breakpoints[breakpointKey]}px)`]
        ) {
          acc['@media'][
            `(min-width: ${theme.breakpoints[breakpointKey]}px)`
          ] = {}
        }
        acc['@media'][`(min-width: ${theme.breakpoints[breakpointKey]}px)`] = {
          ...acc['@media'][
            `(min-width: ${theme.breakpoints[breakpointKey]}px)`
          ],
          [attr]: variant[attr][breakpointKey],
        }
      }
      return acc
    }, acc)
  } else {
    acc[attr] = variant[attr]
  }
  return acc
}

export const responsiveStyleMap = (styleObj) =>
  style(
    Object.keys(styleObj).reduce(
      (acc, attr) => resolveBreakpoints(styleObj, attr, acc),
      {},
    ),
  )
