import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useApolloClient } from '@apollo/client'

import { isDefined } from '@island.is/shared/utils'
import {
  IcelandicGovernmentInstitutionsSortDirection,
  Query,
} from '@island.is/web/graphql/schema'

import {
  AsyncFilterItem,
  AsyncFilterPage,
} from '../components/AsyncFilterSearchAccordion'
import { m } from '../messages'
import {
  GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICE_PAYMENT_TYPE_GROUPS,
  GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICE_PAYMENT_TYPES,
} from '../Overview/Overview.graphql'
import { formatPaymentTypeGroupTooltip } from '../utils'

const MAX_LOOKUP_BATCH = 100

interface KnownGroup {
  item: AsyncFilterItem
  codes: Array<string>
}

interface GroupQueryVariables {
  search?: string
  after?: string | null
  lookup?: Array<string>
  limit?: number
  sortDirection?: IcelandicGovernmentInstitutionsSortDirection
}

const chunk = <T>(values: Array<T>, size: number): Array<Array<T>> => {
  const batches: Array<Array<T>> = []
  for (let i = 0; i < values.length; i += size) {
    batches.push(values.slice(i, i + size))
  }
  return batches
}

/**
 * Drives the "Flokkun" filter, which lists payment type groups while the URL
 * keeps carrying the flat payment type codes they cover. A group is checked
 * only when every one of its codes is present in the URL.
 */
export const useInvoicePaymentTypeGroupFilter = (
  selectedCodes: Array<string> | null | undefined,
) => {
  const apolloClient = useApolloClient()
  const { formatMessage } = useIntl()
  const [knownGroups, setKnownGroups] = useState<Record<string, KnownGroup>>({})

  const rememberGroups = useCallback((groups: Array<KnownGroup>) => {
    if (groups.length === 0) {
      return
    }

    setKnownGroups((prev) => {
      const next = { ...prev }
      groups.forEach((group) => {
        next[group.item.value] = group
      })
      return next
    })
  }, [])

  // Caught here, not in `fetchPage` — the accordion empties the list on a
  // rejected fetch, so a failed name lookup would blank the whole filter.
  const withTooltips = useCallback(
    async (groups: Array<KnownGroup>): Promise<Array<KnownGroup>> => {
      const representatives = groups
        .map((group) => group.codes[0])
        .filter(isDefined)

      if (representatives.length === 0) {
        return groups
      }

      try {
        const namesByCode: Record<string, string> = {}

        for (const batch of chunk(representatives, MAX_LOOKUP_BATCH)) {
          const { data } = await apolloClient.query<Query, GroupQueryVariables>(
            {
              query:
                GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICE_PAYMENT_TYPES,
              variables: { lookup: batch, limit: batch.length },
            },
          )

          data?.icelandicGovernmentInstitutionsInvoicePaymentTypes?.data.forEach(
            (paymentType) => {
              namesByCode[paymentType.id] = paymentType.name
            },
          )
        }

        const and = formatMessage(m.search.listConjunction)

        return groups.map((group) => {
          const name = namesByCode[group.codes[0]]

          return name
            ? {
                ...group,
                item: {
                  ...group.item,
                  tooltip: formatPaymentTypeGroupTooltip(
                    group.codes,
                    name,
                    and,
                  ),
                },
              }
            : group
        })
      } catch {
        return groups
      }
    },
    [apolloClient, formatMessage],
  )

  const fetchGroups = useCallback(
    async (variables: GroupQueryVariables) => {
      const { data } = await apolloClient.query<Query, GroupQueryVariables>({
        query:
          GET_ICELANDIC_GOVERNMENT_INSTITUTIONS_INVOICE_PAYMENT_TYPE_GROUPS,
        variables,
      })

      const result =
        data?.icelandicGovernmentInstitutionsInvoicePaymentTypeGroups

      const groups: Array<KnownGroup> = (result?.data ?? [])
        .filter((group) => group.codes.length > 0)
        .map((group) => ({
          item: { value: group.id, label: group.name },
          codes: group.codes,
        }))

      return { groups: await withTooltips(groups), pageInfo: result?.pageInfo }
    },
    [apolloClient, withTooltips],
  )

  const fetchPage = useCallback(
    async ({
      search,
      after,
    }: {
      search: string
      after?: string | null
    }): Promise<AsyncFilterPage> => {
      const { groups, pageInfo } = await fetchGroups({
        search: search || undefined,
        after: after ?? undefined,
        sortDirection: IcelandicGovernmentInstitutionsSortDirection.Ascending,
      })

      rememberGroups(groups)

      return {
        items: groups.map((group) => group.item),
        hasNextPage: pageInfo?.hasNextPage ?? false,
        endCursor: pageInfo?.endCursor,
      }
    },
    [fetchGroups, rememberGroups],
  )

  const codesKey = (selectedCodes ?? []).join(',')

  useEffect(() => {
    const codes = selectedCodes ?? []
    const accountedFor = new Set(
      Object.values(knownGroups).flatMap((group) => group.codes),
    )
    const missing = codes.filter((code) => !accountedFor.has(code))

    if (missing.length === 0) {
      return
    }

    let cancelled = false

    Promise.all(
      chunk(missing, MAX_LOOKUP_BATCH).map((batch) =>
        fetchGroups({ lookup: batch, limit: batch.length }),
      ),
    )
      .then((results) => {
        if (cancelled) {
          return
        }
        rememberGroups(results.flatMap((result) => result.groups))
      })
      .catch(() => undefined)

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codesKey])

  const selected = useMemo(() => {
    const codeSet = new Set(selectedCodes ?? [])

    return Object.values(knownGroups)
      .filter((group) => group.codes.every((code) => codeSet.has(code)))
      .map((group) => group.item.value)
  }, [knownGroups, selectedCodes])

  const selectedItems = useMemo(
    () =>
      Object.fromEntries(
        selected
          .map((value) => knownGroups[value])
          .filter(isDefined)
          .map((group) => [group.item.value, group.item]),
      ),
    [selected, knownGroups],
  )

  const toPaymentTypeCodes = useCallback(
    (groupIds: Array<string>) =>
      groupIds.flatMap((groupId) => knownGroups[groupId]?.codes ?? []),
    [knownGroups],
  )

  return { fetchPage, selected, selectedItems, toPaymentTypeCodes }
}
