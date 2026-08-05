import { IntlShape } from 'react-intl'
import format from 'date-fns/format'

import { Locale } from '@island.is/shared/types'
import { Grant, GrantStatus } from '@island.is/web/graphql/schema'
import { containsTimePart } from '@island.is/web/utils/containsTimePart'
import { formatDate, toIcelandTime } from '@island.is/web/utils/formatDate'

import { m } from './messages'
import { Status } from './types'

const withUtcSuffix = (
  text: string,
  formatMessage: IntlShape['formatMessage'],
): string => {
  const suffix = formatMessage(m.single.utcSuffix).trim()
  return suffix ? `${text} ${suffix}` : text
}

const formatDeadlinePeriod = (
  dateFrom: string,
  dateTo: string,
): string | undefined => {
  try {
    return `${format(
      toIcelandTime(new Date(dateFrom)),
      'dd.MM.yyyy',
    )} - ${format(toIcelandTime(new Date(dateTo)), 'dd.MM.yyyy')}`
  } catch (e) {
    console.warn('Error formatting deadline period:', e)
    return undefined
  }
}

export const parseStatus = (
  grant: Grant,
  formatMessage: IntlShape['formatMessage'],
  locale: Locale,
  includeUtcSuffix = false,
): Status => {
  switch (grant.status) {
    case GrantStatus.Closed: {
      const date = grant.dateTo
        ? formatDate(toIcelandTime(new Date(grant.dateTo)), locale)
        : undefined

      return {
        applicationStatus: 'closed',
        deadlineStatus: date
          ? formatMessage(
              containsTimePart(date)
                ? m.search.applicationWasOpenToAndWith
                : m.search.applicationWasOpenTo,
              {
                arg: date,
              },
            )
          : formatMessage(m.search.applicationClosed),
        note: grant.statusText ?? undefined,
        deadlinePeriod:
          grant.dateFrom && grant.dateTo
            ? formatDeadlinePeriod(grant.dateFrom, grant.dateTo)
            : undefined,
      }
    }
    case GrantStatus.ClosedOpeningSoon: {
      const date = grant.dateFrom
        ? formatDate(toIcelandTime(new Date(grant.dateFrom)), locale)
        : undefined
      return {
        applicationStatus: 'closed',
        deadlineStatus: date
          ? formatMessage(m.search.applicationOpensAt, {
              arg: date,
            })
          : formatMessage(m.search.applicationClosed),
        note: grant.statusText ?? undefined,
        deadlinePeriod:
          grant.dateFrom && grant.dateTo
            ? formatDeadlinePeriod(grant.dateFrom, grant.dateTo)
            : undefined,
      }
    }
    case GrantStatus.ClosedOpeningSoonWithEstimation: {
      const date = grant.dateFrom
        ? formatDate(
            toIcelandTime(new Date(grant.dateFrom)),
            locale,
            'MMMM yyyy',
          )
        : undefined
      return {
        applicationStatus: 'closed',
        deadlineStatus: date
          ? formatMessage(m.search.applicationEstimatedOpensAt, {
              arg: date,
            })
          : formatMessage(m.search.applicationClosed),
        note: grant.statusText ?? undefined,
      }
    }
    case GrantStatus.ClosedWithNote: {
      return {
        applicationStatus: 'closed',
        deadlineStatus: formatMessage(m.search.applicationSeeDescription),
        note: grant.statusText ?? undefined,
      }
    }
    case GrantStatus.AlwaysOpen: {
      return {
        applicationStatus: 'open',
        deadlineStatus: formatMessage(m.search.applicationAlwaysOpen),
        note: grant.statusText ?? undefined,
      }
    }
    case GrantStatus.Open: {
      const dateString = grant.dateTo
      if (!dateString) {
        return {
          applicationStatus: 'open',
          deadlineStatus: formatMessage(m.search.applicationOpen),
          note: grant.statusText ?? undefined,
          deadlinePeriod:
            grant.dateFrom && grant.dateTo
              ? formatDeadlinePeriod(grant.dateFrom, grant.dateTo)
              : undefined,
        }
      }

      const hasTime = containsTimePart(dateString)
      const dateFormat = hasTime
        ? locale === 'en'
          ? "dd MMMM, 'at' HH:mm"
          : "dd. MMMM, 'kl.' HH:mm"
        : locale === 'en'
        ? 'dd MMMM'
        : 'dd. MMMM'

      const date = formatDate(
        toIcelandTime(new Date(dateString)),
        locale,
        dateFormat,
      )

      const deadlineStatus = date
        ? formatMessage(
            hasTime
              ? m.search.applicationOpensTo
              : m.search.applicationOpensToWithDay,
            {
              arg: date,
            },
          )
        : formatMessage(m.search.applicationOpen)

      return {
        applicationStatus: 'open',
        deadlineStatus:
          hasTime && includeUtcSuffix
            ? withUtcSuffix(deadlineStatus, formatMessage)
            : deadlineStatus,
        note: grant.statusText ?? undefined,
        deadlinePeriod:
          grant.dateFrom && grant.dateTo
            ? formatDeadlinePeriod(grant.dateFrom, grant.dateTo)
            : undefined,
        hasTime,
      }
    }
    case GrantStatus.OpenWithNote: {
      return {
        applicationStatus: 'open',
        deadlineStatus: formatMessage(m.search.applicationSeeDescription),
        note: grant.statusText ?? undefined,
      }
    }
    default: {
      return {
        applicationStatus: 'unknown',
      }
    }
  }
}

export const generateStatusTag = (
  status: Status['applicationStatus'],
  formatMessage: IntlShape['formatMessage'],
) =>
  status !== 'unknown'
    ? {
        label:
          status === 'open'
            ? formatMessage(m.search.applicationOpen)
            : formatMessage(m.search.applicationClosed),
        variant: status === 'open' ? ('mint' as const) : ('rose' as const),
      }
    : undefined
