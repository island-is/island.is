import { style } from '@vanilla-extract/css'
import isObject from 'lodash/isObject'
import * as CSS from 'csstype'

import { theme } from '@island.is/island-ui/theme'

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type ResponsiveProps<T> = {
  [Type in Breakpoint]?: T
}

export const resolveBreakpoints = (variant: any, attr: any, acc: any) => {
  if (isObject(variant[attr])) {
    ;(Object.keys(variant[attr]) as Breakpoint[]).reduce(
      (acc, breakpointKey) => {
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
          acc['@media'][`(min-width: ${theme.breakpoints[breakpointKey]}px)`] =
            {
              ...acc['@media'][
                `(min-width: ${theme.breakpoints[breakpointKey]}px)`
              ],
              [attr]: variant[attr][breakpointKey],
            }
        }
        return acc
      },
      acc,
    )
  } else {
    acc[attr] = variant[attr]
  }
  return acc
}

export const responsiveStyleMap = (
  styleObj: CSS.Properties<string | ResponsiveProps<string | number>>,
) =>
  style(
    Object.keys(styleObj).reduce(
      (acc, attr) => resolveBreakpoints(styleObj, attr, acc),
      {},
    ),
  )
