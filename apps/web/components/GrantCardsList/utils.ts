import { Locale } from '@island.is/shared/types'
import { Grant, GrantStatus } from '@island.is/web/graphql/schema'
import { containsTimePart } from '@island.is/web/utils/containsTimePart'
import { formatDate, toIcelandTime } from '@island.is/web/utils/formatDate'

import { OPEN_GRANT_STATUSES, TranslationKeys } from './types'

export const getTranslationString = (
  key: keyof TranslationKeys,
  namespace: Record<string, string>,
  argToInterpolate?: string,
) => {
  const template = namespace[key] ?? String(key)
  return argToInterpolate
    ? template.replace('{arg}', argToInterpolate)
    : template
}

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
        ? formatDate(toIcelandTime(new Date(grant.dateTo)), locale)
        : undefined
      return date
        ? translationFunction(
            grant.dateTo && containsTimePart(grant.dateTo)
              ? 'applicationWasOpenToAndWith'
              : 'applicationWasOpenTo',
            date,
          )
        : translationFunction('applicationClosed')
    }
    case GrantStatus.ClosedOpeningSoon: {
      const date = grant.dateFrom
        ? formatDate(toIcelandTime(new Date(grant.dateFrom)), locale)
        : undefined
      return date
        ? translationFunction('applicationOpensAt', date)
        : translationFunction('applicationClosed')
    }
    case GrantStatus.ClosedOpeningSoonWithEstimation: {
      const date = grant.dateFrom
        ? formatDate(
            toIcelandTime(new Date(grant.dateFrom)),
            locale,
            'MMMM yyyy',
          )
        : undefined
      return date
        ? translationFunction('applicationEstimatedOpensAt', date)
        : translationFunction('applicationClosed')
    }
    case GrantStatus.AlwaysOpen: {
      return translationFunction('applicationAlwaysOpen')
    }
    case GrantStatus.Open: {
      const dateVal = grant.dateTo
      if (!dateVal) {
        return translationFunction('applicationOpen')
      }
      const hasTime = containsTimePart(dateVal)
      const dateFormat = hasTime
        ? locale === 'en'
          ? "dd MMMM, 'at' HH:mm"
          : "dd. MMMM, 'kl.' HH:mm"
        : locale === 'en'
        ? 'dd MMMM'
        : 'dd. MMMM'

      const date = formatDate(toIcelandTime(new Date(dateVal)), locale, dateFormat)

      return date
        ? translationFunction(
            hasTime ? 'applicationOpensToWithDay' : 'applicationOpensTo',
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
