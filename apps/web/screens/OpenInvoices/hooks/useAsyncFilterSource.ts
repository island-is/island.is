import { useCallback } from 'react'
import { DocumentNode } from 'graphql'

import { useApolloClient } from '@apollo/client'

import { IcelandicGovernmentInstitutionsSortDirection } from '@island.is/web/graphql/schema'

import {
  AsyncFilterItem,
  AsyncFilterPage,
} from '../components/AsyncFilterSearchAccordion'
import { useLookupLabels } from './useLookupLabels'

interface PagedListResult<TItem> {
  data: TItem[]
  pageInfo: {
    hasNextPage: boolean
    endCursor?: string | null
  }
}

/**
 * Builds a `fetchPage`/`selectedLabels` pair for `AsyncFilterSearchAccordion`
 * from a single paginated+lookup-capable GraphQL query, so each filter only
 * has to describe how to read its own query result — not repeat the
 * query/lookup fetching logic itself.
 */
export const useAsyncFilterSource = <TData, TItem>(
  query: DocumentNode,
  extractResult: (data: TData) => PagedListResult<TItem> | null | undefined,
  mapItem: (item: TItem) => AsyncFilterItem,
  selectedValues: string[] | null | undefined,
) => {
  const apolloClient = useApolloClient()

  const fetchPage = useCallback(
    async ({
      search,
      after,
    }: {
      search: string
      after?: string | null
    }): Promise<AsyncFilterPage> => {
      const { data } = await apolloClient.query<
        TData,
        {
          search?: string
          after?: string | null
          sortDirection?: IcelandicGovernmentInstitutionsSortDirection
        }
      >({
        query,
        variables: {
          search: search || undefined,
          after: after ?? undefined,
          sortDirection: IcelandicGovernmentInstitutionsSortDirection.Ascending,
        },
      })

      const result = extractResult(data)

      return {
        items: result?.data.map(mapItem) ?? [],
        hasNextPage: result?.pageInfo.hasNextPage ?? false,
        endCursor: result?.pageInfo.endCursor,
      }
    },
    [apolloClient, query, extractResult, mapItem],
  )

  const fetchLookup = useCallback(
    async (lookup: string[]) => {
      const { data } = await apolloClient.query<TData, { lookup?: string[] }>(
        {
          query,
          variables: { lookup },
        },
      )

      return extractResult(data)?.data.map(mapItem) ?? []
    },
    [apolloClient, query, extractResult, mapItem],
  )

  const selectedLabels = useLookupLabels(selectedValues, fetchLookup)

  return { fetchPage, selectedLabels }
}
