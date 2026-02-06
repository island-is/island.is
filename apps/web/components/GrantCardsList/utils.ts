import format from 'date-fns/format'
import localeEN from 'date-fns/locale/en-GB'
import localeIS from 'date-fns/locale/is'

import { Locale } from '@island.is/shared/types'
import { Grant, GrantStatus } from '@island.is/web/graphql/schema'

import { OPEN_GRANT_STATUSES, TranslationKeys } from './types'

export const getTranslationString = (
  key: keyof TranslationKeys,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  namespace: Record<string, string>,
  argToInterpolate?: string,
) =>
  argToInterpolate
    ? namespace[key].replace('{arg}', argToInterpolate)
    : namespace[key]

export const formatDate = (
  date: Date,
  locale: Locale,
  stringFormat = 'dd. MMMM yyyy',
): string | undefined => {
  try {
    return format(date, stringFormat, {
      locale: locale === 'is' ? localeIS : localeEN,
    })
  } catch (e) {
    console.warn('Error formatting date')
    return
  }
}

export const containsTimePart = (date: string) => date.includes('T')

export const isGrantOpen = (grant: Grant): 'open' | 'closed' | 'unknown' => {
  if (!grant.status) {
    return 'unknown'
  }

  return OPEN_GRANT_STATUSES.includes(grant.status) ? 'open' : 'closed'
}

export const parseGrantStatus = (
  grant: Grant,
  locale: Locale,
  translationFunction: (
    key: keyof TranslationKeys,
    argToInterpolate?: string,
  ) => string,
) => {
  switch (grant.status) {
    case GrantStatus.Closed: {
      const date = grant.dateTo
        ? formatDate(new Date(grant.dateTo), locale)
        : undefined
      return date
        ? translationFunction(
            containsTimePart(date)
              ? 'applicationWasOpenToAndWith'
              : 'applicationWasOpenTo',
            date,
          )
        : translationFunction('applicationClosed')
    }
    case GrantStatus.ClosedOpeningSoon: {
      const date = grant.dateFrom
        ? formatDate(new Date(grant.dateFrom), locale)
        : undefined
      return date
        ? translationFunction('applicationOpensAt', date)
        : translationFunction('applicationClosed')
    }
    case GrantStatus.ClosedOpeningSoonWithEstimation: {
      const date = grant.dateFrom
        ? formatDate(new Date(grant.dateFrom), locale, 'MMMM yyyy')
        : undefined
      return date
        ? translationFunction('applicationEstimatedOpensAt', date)
        : translationFunction('applicationClosed')
    }
    case GrantStatus.AlwaysOpen: {
      return translationFunction('applicationAlwaysOpen')
    }
    case GrantStatus.Open: {
      const date = grant.dateTo
        ? formatDate(new Date(grant.dateTo), locale, 'dd. MMMM.')
        : undefined
      return date
        ? translationFunction(
            containsTimePart(date)
              ? 'applicationOpensToWithDay'
              : 'applicationOpensTo',
            date,
          )
        : translationFunction('applicationOpen')
    }
    case GrantStatus.ClosedWithNote:
    case GrantStatus.OpenWithNote: {
      return translationFunction('applicationSeeDescription')
    }
    default:
      return
  }
}
