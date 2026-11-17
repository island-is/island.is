import { useRef, useState } from 'react'
import format from 'date-fns/format'
import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/client'

import { ActionCard, Box, InfoCardGrid, Text } from '@island.is/island-ui/core'
import { isDefined } from '@island.is/shared/utils'
import { GenericList } from '@island.is/web/components'
import {
  Grant,
  GrantCardsList as GrantCardsListSchema,
  GrantCardsListSorting,
  GrantList,
  QueryGetGrantsArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { getFilterCategories } from '@island.is/web/screens/Organization/PublishedMaterial/utils'
import { GET_GRANTS_QUERY } from '@island.is/web/screens/queries/Grants'

import { TranslationKeys } from './types'
import {
  buildGrantsQueryInput,
  getCappedTotal,
  getTranslationString,
  getVisibleCountOnPage,
  GRANT_CARDS_PAGE_SIZE,
  isGrantOpen,
  parseGrantStatus,
} from './utils'

interface SliceProps {
  slice: GrantCardsListSchema
}

type GetTranslation = (
  key: keyof TranslationKeys,
  argToInterpolate?: string,
) => string

const sortGrants = (
  grants: Grant[],
  sorting: GrantCardsListSchema['sorting'],
) => {
  const sorted = [...grants]
  if (sorted.length > 1) {
    if (sorting === GrantCardsListSorting.MostRecentlyUpdatedFirst) {
      sorted.sort(
        (a, b) =>
          new Date(a.lastUpdateTimestamp).getTime() -
          new Date(b.lastUpdateTimestamp).getTime(),
      )
    } else if (sorting === GrantCardsListSorting.Alphabetical) {
      sorted.sort((a, b) => a.name.localeCompare(b.name))
    }
  }
  return sorted
}

const GrantCards = ({
  grants,
  getTranslation,
}: {
  grants: Grant[]
  getTranslation: GetTranslation
}) => {
  const { activeLocale } = useI18n()
  const { linkResolver } = useLinkResolver()

  const cards = grants
    .map((grant) => {
      const grantIsOpen = isGrantOpen(grant)
      if (grant.id) {
        return {
          id: grant.id,
          eyebrow: grant.fund?.title ?? grant.name ?? '',
          subEyebrow: grant.fund?.parentOrganization?.title,
          title: grant.name ?? '',
          description: grant.description ?? '',
          logo:
            grant.fund?.featuredImage?.url ??
            grant.fund?.parentOrganization?.logo?.url ??
            '',
          logoAlt:
            grant.fund?.featuredImage?.title ??
            grant.fund?.parentOrganization?.logo?.title ??
            '',
          link: {
            label: getTranslation('applicationClosed'),
            href: linkResolver(
              'grantsplazagrant',
              [grant?.applicationId ?? ''],
              activeLocale,
            ).href,
          },
          tags: [
            grantIsOpen !== 'unknown'
              ? {
                  label: getTranslation(
                    grantIsOpen === 'open'
                      ? 'applicationOpen'
                      : 'applicationClosed',
                  ),
                  variant: grantIsOpen === 'open' ? 'mint' : 'rose',
                }
              : undefined,
          ].filter(isDefined),
          detailLines: [
            grant.dateFrom && grant.dateTo
              ? {
                  icon: 'calendar' as const,
                  text: `${format(
                    new Date(grant.dateFrom),
                    'dd.MM.yyyy',
                  )} - ${format(new Date(grant.dateTo), 'dd.MM.yyyy')}`,
                }
              : null,
            grant.status
              ? {
                  icon: 'time' as const,
                  text: parseGrantStatus(grant, activeLocale, getTranslation),
                }
              : undefined,
            grant.categoryTags
              ? {
                  icon: 'informationCircle' as const,
                  text: grant.categoryTags
                    .map((ct) => ct.title)
                    .filter(isDefined)
                    .join(', '),
                }
              : undefined,
          ].filter(isDefined),
        }
      }
      return null
    })
    .filter(isDefined)

  return (
    <InfoCardGrid
      maxColumnCount={1}
      cardsBorder="blue200"
      variant="detailed"
      cards={cards}
    />
  )
}

const SearchableGrantCardsList = ({
  slice,
  getTranslation,
}: SliceProps & { getTranslation: GetTranslation }) => {
  const { activeLocale } = useI18n()
  const showPagination = Boolean(slice.showPagination)
  const filterTags = slice.filterTags ?? []
  const cap = slice.maxNumberOfCards

  const [result, setResult] = useState<{ items: Grant[]; total: number }>({
    items: [],
    total: 0,
  })
  const [errorOccurred, setErrorOccurred] = useState(false)
  const latestRequestId = useRef(0)

  const [getGrants, { loading, called }] = useLazyQuery<
    { getGrants: GrantList },
    QueryGetGrantsArgs
  >(GET_GRANTS_QUERY)

  const fetchListItems = ({
    page,
    searchValue,
    tags,
    tagGroups,
  }: {
    page: number
    searchValue: string
    tags: string[]
    tagGroups: Record<string, string[]>
  }) => {
    const input = buildGrantsQueryInput({
      fundIds: slice.fundIds ?? [],
      lang: activeLocale,
      page,
      searchValue,
      tags,
      tagGroups,
      showPagination,
      maxNumberOfCards: cap,
      sorting: slice.sorting,
    })

    if (!input) {
      setResult({ items: [], total: 0 })
      return
    }

    const requestId = ++latestRequestId.current

    getGrants({ variables: { input } })
      .then((res) => {
        // Ignore responses that arrive after a newer request was made
        if (requestId !== latestRequestId.current) {
          return
        }
        if (!res.data) {
          setErrorOccurred(true)
          return
        }
        const { items, total } = res.data.getGrants
        const visibleCount = showPagination
          ? getVisibleCountOnPage(page, cap, GRANT_CARDS_PAGE_SIZE)
          : items.length
        setResult({
          items: items.slice(0, visibleCount),
          // A page past the cap shows no results instead of an empty grid
          total:
            visibleCount === 0
              ? 0
              : getCappedTotal(total, showPagination ? cap : input.size),
        })
        setErrorOccurred(false)
      })
      .catch(() => {
        if (requestId === latestRequestId.current) {
          setErrorOccurred(true)
        }
      })
  }

  return (
    <GenericList
      searchQueryId={`${slice.id}q`}
      pageQueryId={`${slice.id}page`}
      tagQueryId={`${slice.id}tag`}
      filterTags={filterTags}
      searchInputPlaceholder={slice.searchInputPlaceholder}
      showSearchInput={Boolean(slice.showSearchInput)}
      showSearchFilters={getFilterCategories(filterTags).length > 0}
      showPagination={showPagination}
      fetchListItems={fetchListItems}
      totalItems={result.total}
      loading={loading || !called}
      displayError={errorOccurred}
    >
      <GrantCards grants={result.items} getTranslation={getTranslation} />
    </GenericList>
  )
}

const GrantCardsList = ({ slice }: SliceProps) => {
  const router = useRouter()

  const getTranslation: GetTranslation = (key, argToInterpolate) =>
    getTranslationString(key, slice.namespace, argToInterpolate)

  const { activeLocale } = useI18n()

  const title = slice.displayTitle && (
    <Box marginBottom={2}>
      <Text variant="h3" as="h3" color="dark400">
        {slice.title}
      </Text>
    </Box>
  )

  const isSearchable =
    Boolean(slice.showSearchInput) ||
    Boolean(slice.showPagination) ||
    getFilterCategories(slice.filterTags ?? []).length > 0

  if (isSearchable) {
    return (
      <>
        {title}
        <SearchableGrantCardsList
          slice={slice}
          getTranslation={getTranslation}
        />
      </>
    )
  }

  const grantItems = [...(slice.resolvedGrantsList?.items ?? [])]

  if (grantItems.length === 1 && !slice.alwaysDisplayResultsAsCards) {
    const grant = grantItems[0]

    const grantStatus = isGrantOpen(grant)

    const cardText =
      grantStatus !== 'unknown'
        ? `${getTranslation(
            grantStatus === 'open' ? 'applicationOpen' : 'applicationClosed',
          )} / ${parseGrantStatus(grant, activeLocale, getTranslation)}`
        : undefined

    return (
      <>
        {title}
        <ActionCard
          heading={grant.name}
          text={cardText}
          backgroundColor="blue"
          cta={{
            disabled: isGrantOpen(grant) !== 'open',
            size: 'small',
            label: grant.applicationButtonLabel ?? getTranslation('apply'),
            onClick: () => router.push(grant.applicationUrl?.slug ?? ''),
            icon: 'open',
            iconType: 'outline',
          }}
        />
      </>
    )
  }

  return (
    <>
      {title}
      <GrantCards
        grants={sortGrants(grantItems, slice.sorting)}
        getTranslation={getTranslation}
      />
    </>
  )
}

export default GrantCardsList
