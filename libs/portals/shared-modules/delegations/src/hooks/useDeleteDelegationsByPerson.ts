import { Reference, useApolloClient } from '@apollo/client'
import { useCallback } from 'react'

import { toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m as coreMessages } from '@island.is/portals/core'

import { useDeleteAuthDelegationMutation } from '../components/access/AccessDeleteModal/AccessDeleteModal.generated'
import { m } from '../lib/messages'

export type DeletableDelegationsByPerson = {
  nationalId: string
  type?: string | null
  scopes: ReadonlyArray<{
    delegationId?: string | null
    displayName?: string | null
  }>
}

type Options = {
  direction: 'outgoing' | 'incoming'
}

const isDeletionSuccessful = (result: {
  errors?: readonly unknown[]
  data?: { deleteAuthDelegation?: boolean | null } | null
}) => !result.errors && result.data?.deleteAuthDelegation === true

const getDelegationLabel = (
  person: DeletableDelegationsByPerson,
  delegationId: string,
) => {
  const scopeLabels = [
    ...new Set(
      person.scopes
        .filter((scope) => scope.delegationId === delegationId)
        .map((scope) => scope.displayName),
    ),
  ]

  return scopeLabels.length > 0 ? scopeLabels.join(', ') : delegationId
}

export const useDeleteDelegationsByPerson = ({ direction }: Options) => {
  const client = useApolloClient()
  const { formatMessage } = useLocale()
  const [deleteDelegation, { loading }] = useDeleteAuthDelegationMutation()

  const queryFieldName =
    direction === 'outgoing'
      ? 'authDelegationsGroupedByIdentityOutgoing'
      : 'authDelegationsGroupedByIdentityIncoming'

  const evictPerson = useCallback(
    (person: DeletableDelegationsByPerson) => {
      const cacheId = client.cache.identify({
        __typename: 'AuthDelegationsGroupedByIdentity',
        nationalId: person.nationalId,
        type: person.type,
      })
      if (cacheId) {
        client.cache.evict({ id: cacheId })
        client.cache.gc()
      }

      client.cache.modify({
        fields: {
          [queryFieldName](existing: readonly Reference[] = [], { readField }) {
            return existing.filter(
              (ref) =>
                !(
                  readField('nationalId', ref) === person.nationalId &&
                  readField('type', ref) === person.type
                ),
            )
          },
        },
      })
    },
    [client.cache, queryFieldName],
  )

  const evictSucceededDelegations = useCallback(
    (
      person: DeletableDelegationsByPerson,
      succeededDelegationIds: readonly string[],
    ) => {
      if (succeededDelegationIds.length === 0) return

      const allDelegationIds = [
        ...new Set(
          person.scopes
            .map((scope) => scope.delegationId)
            .filter((id): id is string => !!id),
        ),
      ]

      if (succeededDelegationIds.length === allDelegationIds.length) {
        evictPerson(person)
        return
      }

      const personCacheId = client.cache.identify({
        __typename: 'AuthDelegationsGroupedByIdentity',
        nationalId: person.nationalId,
        type: person.type,
      })
      if (!personCacheId) return

      const succeededDelegationIdSet = new Set(succeededDelegationIds)
      const removedScopeCount = person.scopes.filter(
        (scope) =>
          scope.delegationId &&
          succeededDelegationIdSet.has(scope.delegationId),
      ).length

      client.cache.modify({
        id: personCacheId,
        fields: {
          scopes(existing: readonly Reference[] = [], { readField }) {
            return existing.filter(
              (scopeRef) =>
                !succeededDelegationIdSet.has(
                  readField('delegationId', scopeRef) as string,
                ),
            )
          },
          totalScopeCount(existing: number) {
            return Math.max(0, existing - removedScopeCount)
          },
        },
      })
    },
    [client.cache, evictPerson],
  )

  const deleteByPerson = useCallback(
    async (person: DeletableDelegationsByPerson): Promise<boolean> => {
      const delegationIds = [
        ...new Set(
          person.scopes
            .map((s) => s.delegationId)
            .filter((id): id is string => !!id),
        ),
      ]

      if (delegationIds.length === 0) return true

      const results = await Promise.allSettled(
        delegationIds.map((delegationId) =>
          deleteDelegation({
            variables: { input: { delegationId } },
          }),
        ),
      )

      const succeededDelegationIds: string[] = []
      const failedDelegationIds: string[] = []

      delegationIds.forEach((delegationId, index) => {
        const settled = results[index]
        if (
          settled.status === 'fulfilled' &&
          isDeletionSuccessful(settled.value)
        ) {
          succeededDelegationIds.push(delegationId)
        } else {
          failedDelegationIds.push(delegationId)
        }
      })

      if (succeededDelegationIds.length > 0) {
        evictSucceededDelegations(person, succeededDelegationIds)
      }

      if (failedDelegationIds.length === 0) {
        return true
      }

      if (failedDelegationIds.length === delegationIds.length) {
        toast.error(formatMessage(coreMessages.somethingWrong))
      } else {
        const failedLabels = failedDelegationIds.map((delegationId) =>
          getDelegationLabel(person, delegationId),
        )
        toast.error(
          formatMessage(m.deleteDelegationsFailed, {
            delegations: failedLabels.join(', '),
          }),
        )
      }

      return false
    },
    [deleteDelegation, evictSucceededDelegations, formatMessage],
  )

  return { deleteByPerson, loading }
}
