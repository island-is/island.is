import { style } from 'treat'
import { isObject } from 'lodash'
import { theme } from '@island.is/island-ui/theme'

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

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
          acc['@media'][
            `(min-width: ${theme.breakpoints[breakpointKey]}px)`
          ] = {
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

export const responsiveStyleMap = (styleObj: any) =>
  style(
    Object.keys(styleObj).reduce(
      (acc, attr) => resolveBreakpoints(styleObj, attr, acc),
      {},
    ),
  )
