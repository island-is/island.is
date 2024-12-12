import format from 'date-fns/format'
import localeEn from 'date-fns/locale/en-GB'
import localeIS from 'date-fns/locale/is'

import { FormatMessage } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'
import { Grant, GrantStatus } from '@island.is/web/graphql/schema'

import { m } from './messages'
import { IntlFormatters, IntlShape } from 'react-intl'

interface Status {
  applicationStatus: 'open' | 'closed' | 'unknown'
  deadlineStatus: string
  note?: string
}

const formatDate = (
  date: Date,
  locale: Locale,
  stringFormat = 'dd.MMMM yyyy',
) =>
  format(date, stringFormat, {
    locale: locale === 'is' ? localeIS : localeEn,
  })

export const containsTimePart = (date: string) => date.includes('T')

export const parseStatus = (
  grant: Grant,
  formatMessage: IntlShape['formatMessage'],
  locale: Locale,
): Status => {
  switch (grant.status) {
    case GrantStatus.Closed: {
      return {
        applicationStatus: 'closed',
        deadlineStatus: grant.dateTo
          ? formatMessage(
              containsTimePart(grant.dateTo)
                ? m.search.applicationWasOpenToAndWith
                : m.search.applicationWasOpenTo,
              {
                arg: formatDate(new Date(grant.dateTo), locale),
              },
            )
          : formatMessage(m.search.applicationClosed),
        note: grant.statusText ?? undefined,
      }
    }
    case GrantStatus.ClosedOpeningSoon: {
      return {
        applicationStatus: 'closed',
        deadlineStatus: grant.dateFrom
          ? formatMessage(m.search.applicationOpensAt, {
              arg: formatDate(new Date(grant.dateFrom), locale),
            })
          : formatMessage(m.search.applicationClosed),
        note: grant.statusText ?? undefined,
      }
    }
    case GrantStatus.ClosedOpeningSoonWithEstimation: {
      return {
        applicationStatus: 'closed',
        deadlineStatus: grant.dateFrom
          ? formatMessage(m.search.applicationEstimatedOpensAt, {
              arg: formatDate(new Date(grant.dateFrom), locale, 'MMMM yyyy'),
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
      return {
        applicationStatus: 'open',
        deadlineStatus: grant.dateTo
          ? formatMessage(
              containsTimePart(grant.dateTo)
                ? m.search.applicationOpensToWithDay
                : m.search.applicationOpensTo,
              {
                arg: formatDate(new Date(grant.dateTo), locale, 'dd.MMMM.'),
              },
            )
          : formatMessage(m.search.applicationOpen),
        note: grant.statusText ?? undefined,
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
        deadlineStatus: '',
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
