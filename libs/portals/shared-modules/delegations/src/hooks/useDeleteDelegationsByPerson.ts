import { Reference, useApolloClient } from '@apollo/client'
import { useCallback } from 'react'

import { toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m as coreMessages } from '@island.is/portals/core'

import { useDeleteAuthDelegationMutation } from '../components/access/AccessDeleteModal/AccessDeleteModal.generated'

export type DeletableDelegationsByPerson = {
  nationalId: string
  type?: string | null
  scopes: ReadonlyArray<{ delegationId?: string | null }>
}

type Options = {
  direction: 'outgoing' | 'incoming'
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

      try {
        const results = await Promise.all(
          delegationIds.map((delegationId) =>
            deleteDelegation({
              variables: { input: { delegationId } },
            }),
          ),
        )

        const allSucceeded = results.every(
          (result) => !result.errors && result.data?.deleteAuthDelegation === true,
        )

        if (!allSucceeded) {
          toast.error(formatMessage(coreMessages.somethingWrong))
          return false
        }

        evictPerson(person)
        return true
      } catch {
        toast.error(formatMessage(coreMessages.somethingWrong))
        return false
      }
    },
    [deleteDelegation, evictPerson, formatMessage],
  )

  return { deleteByPerson, loading }
}
