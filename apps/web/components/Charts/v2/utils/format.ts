import format from 'date-fns/format'
import round from 'lodash/round'

import type { Locale } from '@island.is/shared/types'

import { messages } from '../messages'

export const formatDate = (date: Date | string | number) => {
  try {
    return format(new Date(date), 'MMM yy')
  } catch {
    return ''
  }
}

export const formatValueForPresentation = (
  activeLocale: Locale,
  possiblyRawValue: number | string,
  reduceAndRoundValue = true,
) => {
  if (possiblyRawValue === undefined) {
    return ''
  }

  try {
    if (
      typeof possiblyRawValue === 'number' ||
      !Number.isNaN(possiblyRawValue)
    ) {
      const value = Number(possiblyRawValue)

      let divider = 1
      let postfix = ''
      let precision = 0

      if (reduceAndRoundValue && value >= 1e6) {
        divider = 1e6
        postfix = messages[activeLocale].millionPostfix
        precision = 1
      } else if (reduceAndRoundValue && value >= 1e4) {
        divider = 1e3
        postfix = messages[activeLocale].thousandPostfix
      }

      const v = round(value / divider, precision)

      return `${v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}${postfix}`
    }
  } catch {
    // pass
  }

  return possiblyRawValue?.toString()
}

export const formatPercentageForPresentation = (
  percentage: number,
  precision: number | undefined = undefined,
) => {
  return `${round(percentage * 100, precision ?? percentage < 0.1 ? 1 : 0)}%`
}
