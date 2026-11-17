import { Locale } from '@island.is/shared/types'
import {
  GetGrantsInput,
  GetGrantsInputSortByEnum,
  Grant,
  GrantCardsListSorting,
  GrantStatus,
} from '@island.is/web/graphql/schema'
import { containsTimePart } from '@island.is/web/utils/containsTimePart'
import { formatDate, toIcelandTime } from '@island.is/web/utils/formatDate'

import { OPEN_GRANT_STATUSES, TranslationKeys } from './types'

export const GRANT_CARDS_PAGE_SIZE = 10

export const getCappedTotal = (total: number, cap: number | null | undefined) =>
  cap == null ? total : Math.min(total, cap)

export const getVisibleCountOnPage = (
  page: number,
  cap: number | null | undefined,
  pageSize: number,
) => {
  if (cap == null) {
    return pageSize
  }
  return Math.min(Math.max(cap - (page - 1) * pageSize, 0), pageSize)
}

export const buildGrantsQueryInput = ({
  fundIds,
  lang,
  page,
  searchValue,
  tags,
  tagGroups,
  showPagination,
  maxNumberOfCards,
  sorting,
}: {
  fundIds: string[]
  lang: Locale
  page: number
  searchValue: string
  tags: string[]
  tagGroups?: Record<string, string[]>
  showPagination: boolean
  maxNumberOfCards?: number | null
  sorting?: GrantCardsListSorting | null
}): GetGrantsInput | null => {
  if (fundIds.length === 0 || maxNumberOfCards === 0) {
    return null
  }

  const input: GetGrantsInput = {
    funds: fundIds,
    lang,
    page: showPagination ? page : 1,
    size: showPagination
      ? GRANT_CARDS_PAGE_SIZE
      : maxNumberOfCards ?? GRANT_CARDS_PAGE_SIZE,
    sort:
      sorting === GrantCardsListSorting.Alphabetical
        ? GetGrantsInputSortByEnum.Alphabetical
        : GetGrantsInputSortByEnum.RecentlyUpdated,
  }

  if (searchValue) {
    input.search = searchValue
  }
  if (tags.length > 0) {
    input.categories = tags
    input.tagGroups = tagGroups
  }

  return input
}

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

      const date = formatDate(
        toIcelandTime(new Date(dateVal)),
        locale,
        dateFormat,
      )

      return date
        ? translationFunction(
            hasTime ? 'applicationOpensTo' : 'applicationOpensToWithDay',
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
