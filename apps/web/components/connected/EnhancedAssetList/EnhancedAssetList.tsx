import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useDebounce } from 'react-use'
import { useQuery } from '@apollo/client'

import {
  Box,
  Button,
  FilterInput,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import type {
  ConnectedComponent,
  Query,
  QueryGetPublishedMaterialArgs,
} from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'
import { GET_PUBLISHED_MATERIAL_QUERY } from '@island.is/web/screens/queries/PublishedMaterial'
import { PublishedMaterialItem } from '@island.is/web/screens/Organization/PublishedMaterial/components/PublishedMaterialItem'

import { m } from './translation.strings'

const DEFAULT_ITEMS_PER_PAGE = 10
const DEBOUNCE_TIME_IN_MS = 300
const DEFAULT_SORT = { field: 'releaseDate', order: 'desc' }

interface EnhancedAssetListProps {
  slice: ConnectedComponent
}

/**
 * Lists enhanced assets for an organization with a fixed filter set in the
 * connected component config. Users can narrow the results with a search
 * string, but the configured filter always applies.
 *
 * Config example:
 * {
 *   "organizationSlug": "stafraent-island",
 *   "tags": ["arsskyrsla"],
 *   "tagGroups": { "tegund": ["arsskyrsla"] },
 *   "size": 10,
 *   "sort": { "field": "releaseDate", "order": "desc" }
 * }
 *
 * "tagGroups" is optional, when left out all tags are put in a single group,
 * meaning an asset only needs to have one of the tags to be included.
 */
const EnhancedAssetList = ({ slice }: EnhancedAssetListProps) => {
  const { formatMessage } = useIntl()
  const { activeLocale } = useI18n()
  const [searchValue, setSearchValue] = useState('')
  const [searchString, setSearchString] = useState('')
  // The page number is 1-based meaning that page 1 is the first page
  const [page, setPage] = useState(1)

  const config = slice.configJson ?? {}
  const tags: string[] = config.tags ?? []
  const tagGroups: Record<string, string[]> =
    config.tagGroups ?? (tags.length > 0 ? { preselected: tags } : {})
  const size: number = config.size ?? DEFAULT_ITEMS_PER_PAGE

  useDebounce(
    () => {
      setPage(1)
      // Remove a trailing acute accent since it's a dead key that is still being composed
      setSearchString(
        searchValue.endsWith('´') ? searchValue.slice(0, -1) : searchValue,
      )
    },
    DEBOUNCE_TIME_IN_MS,
    [searchValue],
  )

  const { data, loading, error, fetchMore } = useQuery<
    Query,
    QueryGetPublishedMaterialArgs
  >(GET_PUBLISHED_MATERIAL_QUERY, {
    variables: {
      input: {
        lang: activeLocale,
        organizationSlug: config.organizationSlug,
        tags,
        tagGroups,
        page: 1,
        searchString,
        size,
        sort: config.sort ?? DEFAULT_SORT,
      },
    },
  })

  const items = data?.getPublishedMaterial?.items ?? []
  const total = data?.getPublishedMaterial?.total ?? 0
  const numberOfItemsThatCouldBeLoaded = total - items.length

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchMore({
      variables: {
        input: {
          lang: activeLocale,
          organizationSlug: config.organizationSlug,
          tags,
          tagGroups,
          page: nextPage,
          searchString,
          size,
          sort: config.sort ?? DEFAULT_SORT,
        },
      },
      updateQuery: (prevResult, { fetchMoreResult }) => ({
        ...fetchMoreResult,
        getPublishedMaterial: {
          ...fetchMoreResult.getPublishedMaterial,
          items: [
            ...prevResult.getPublishedMaterial.items,
            ...fetchMoreResult.getPublishedMaterial.items,
          ],
        },
      }),
    })
  }

  return (
    <Stack space={3}>
      <FilterInput
        name={`enhanced-asset-list-search-${slice.id}`}
        placeholder={formatMessage(m.searchPlaceholder)}
        value={searchValue}
        onChange={setSearchValue}
      />

      {error && <Text>{formatMessage(m.errorLoading)}</Text>}

      {!error && loading && items.length === 0 && (
        <SkeletonLoader
          height={100}
          width="100%"
          borderRadius="large"
          repeat={3}
          space={2}
        />
      )}

      {!error && !loading && items.length === 0 && (
        <Text>{formatMessage(m.noResultsFound)}</Text>
      )}

      {items.length > 0 && (
        <Stack space={2}>
          {items.map((item, index) => (
            <PublishedMaterialItem key={`${item.id}-${index}`} item={item} />
          ))}
        </Stack>
      )}

      {numberOfItemsThatCouldBeLoaded > 0 && (
        <Box display="flex" justifyContent="center" marginTop={3}>
          <Button onClick={loadMore} disabled={loading}>
            {formatMessage(m.seeMore)} ({numberOfItemsThatCouldBeLoaded})
          </Button>
        </Box>
      )}
    </Stack>
  )
}

export default EnhancedAssetList
