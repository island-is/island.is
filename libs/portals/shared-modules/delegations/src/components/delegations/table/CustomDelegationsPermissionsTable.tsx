import {
  Box,
  Button,
  DatePicker,
  Table as T,
  Text,
  toast,
} from '@island.is/island-ui/core'
import format from 'date-fns/format'
import { AuthDelegationsGroupedByIdentityOutgoingQuery } from '../outgoing/DelegationsGroupedByIdentityOutgoing.generated'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { m as coreMessages } from '@island.is/portals/core'

import { useState } from 'react'
import { Reference, useApolloClient } from '@apollo/client'
import { useDelegationForm } from '../../../context'
import { AuthDelegationScope, AuthDomain } from '@island.is/api/schema'
import { DeleteAccessModal } from '../../modals/DeleteAccessModal'
import { usePatchAuthDelegationMutation } from '../../../screens/EditAccess.tsx/EditAccess.generated'

type PersonCentricDelegation =
  AuthDelegationsGroupedByIdentityOutgoingQuery['authDelegationsGroupedByIdentityOutgoing'][number]

const CustomDelegationsPermissionsTable = ({
  data,
  direction,
}: {
  data: PersonCentricDelegation
  direction: 'outgoing' | 'incoming'
}) => {
  const { formatMessage } = useLocale()
  const client = useApolloClient()
  const scopes = data.scopes
  const [patchDelegation] = usePatchAuthDelegationMutation()

  const { setSelectedScopes, clearForm } = useDelegationForm()

  const [scopeToDelete, setScopeToDelete] =
    useState<AuthDelegationScope | null>(null)
  const headerArray = [
    { value: formatMessage(m.headerDomain) },
    { value: formatMessage(m.headerScopeName) },
    { value: formatMessage(m.headerRegisteredDate) },
    { value: formatMessage(m.headerValidityPeriod) },
    // { value: 'Síðast notað' }, // TODO: Data not available yet
    { value: '' },
  ]

  const personCacheId = client.cache.identify({
    __typename: 'AuthDelegationsGroupedByIdentity',
    nationalId: data.nationalId,
    type: data.type,
  })

  const handleDateChange = async (
    scope: typeof scopes[number],
    newDate: Date,
  ) => {
    const delegationId =
      'delegationId' in scope ? scope.delegationId : undefined
    if (!delegationId) return

    try {
      await patchDelegation({
        variables: {
          input: {
            delegationId,
            updateScopes: [
              {
                name: scope.name,
                validTo: newDate,
              },
            ],
          },
        },
        update: (cache) => {
          cache.modify({
            id: personCacheId,
            fields: {
              scopes(existing: readonly Reference[], { readField }) {
                return existing.map((scopeRef) =>
                  readField('name', scopeRef) === scope.name &&
                  readField('delegationId', scopeRef) === delegationId
                    ? { ...scopeRef, validTo: newDate.toISOString() }
                    : scopeRef,
                )
              },
            },
          })
        },
      })
      toast.success(formatMessage(m.scopeValidityPeriodUpdated))
    } catch {
      toast.error(formatMessage(coreMessages.somethingWrong))
    }
  }

  const handleDeleteScope = async (
    delegationId?: string,
    scopeName?: string,
  ) => {
    if (!delegationId || !scopeName) return
    try {
      await patchDelegation({
        variables: {
          input: {
            delegationId,
            deleteScopes: [scopeName],
          },
        },
        update: (cache) => {
          cache.modify({
            id: personCacheId,
            fields: {
              scopes(existing: readonly Reference[], { readField }) {
                return existing.filter(
                  (scopeRef) =>
                    !(
                      readField('name', scopeRef) === scopeName &&
                      readField('delegationId', scopeRef) === delegationId
                    ),
                )
              },
              totalScopeCount(existing: number) {
                return existing - 1
              },
            },
          })
        },
      })
    } catch {
      toast.error(formatMessage(coreMessages.somethingWrong))
    }
  }

  return (
    <Box>
      <T.Table>
        <T.Head>
          <T.Row>
            {headerArray.map((item, i) => (
              <T.HeadData key={item.value + i} style={{ paddingInline: 16 }}>
                <Text variant="medium" fontWeight="semiBold">
                  {item.value}
                </Text>
              </T.HeadData>
            ))}
          </T.Row>
        </T.Head>
        <T.Body>
          {scopes?.map((scope) => {
            return (
              <T.Row key={scope.id}>
                <T.Data style={{ paddingInline: 16 }}>
                  <Text variant="medium">{scope.domain?.displayName}</Text>
                </T.Data>
                <T.Data style={{ paddingInline: 16 }}>
                  <Text variant="medium">{scope.displayName}</Text>
                </T.Data>
                <T.Data style={{ paddingInline: 16 }}>
                  <Text variant="medium">
                    {scope.validFrom
                      ? format(new Date(scope.validFrom), 'dd.MM.yyyy')
                      : '-'}
                  </Text>
                </T.Data>
                <T.Data style={{ display: 'flex', paddingInline: 16 }}>
                  {direction === 'incoming' ? (
                    <Text variant="medium">
                      {scope.validTo
                        ? format(new Date(scope.validTo), 'dd.MM.yyyy')
                        : '-'}
                    </Text>
                  ) : (
                    <Box flexShrink={1}>
                      <DatePicker
                        name={`validTo-${scope.id}`}
                        locale="is"
                        placeholderText={formatMessage(m.headerValidityPeriod)}
                        selected={
                          scope.validTo ? new Date(scope.validTo) : undefined
                        }
                        handleChange={(date) => handleDateChange(scope, date)}
                        size="xs"
                        backgroundColor="blue"
                        detatchedCalendar={true}
                      />
                    </Box>
                  )}
                </T.Data>
                <T.Data style={{ paddingInline: 16 }}>
                  <Box display="flex" justifyContent="flexEnd">
                    <Box flexShrink={0}>
                      <Button
                        variant="text"
                        icon="trash"
                        iconType="outline"
                        size="small"
                        colorScheme="destructive"
                        onClick={() => {
                          setScopeToDelete(scope as AuthDelegationScope)

                          setSelectedScopes([
                            {
                              name: scope.name,
                              displayName: scope.displayName,
                              description: scope.apiScope?.description,
                              domain: scope.domain as AuthDomain,
                              delegationId: scope.delegationId ?? undefined,
                              validTo: scope.validTo
                                ? new Date(scope.validTo)
                                : undefined,
                            },
                          ])
                        }}
                      >
                        {formatMessage(coreMessages.buttonDestroy)}
                      </Button>
                    </Box>
                  </Box>
                </T.Data>
              </T.Row>
            )
          })}
        </T.Body>
      </T.Table>
      <DeleteAccessModal
        onClose={() => {
          setScopeToDelete(null)
          // timeout to fix visual glitch
          setTimeout(clearForm, 300)
        }}
        isVisible={!!scopeToDelete}
        direction={direction}
        otherIdentity={{ name: data.name, nationalId: data.nationalId }}
        onDelete={() => {
          const delegationId = scopeToDelete?.delegationId ?? undefined
          const scopeName = scopeToDelete?.name ?? undefined
          setScopeToDelete(null)
          handleDeleteScope(delegationId, scopeName).finally(() =>
            // timeout to fix visual glitch
            setTimeout(clearForm, 300),
          )
        }}
        loading={false} //todo
      />
    </Box>
  )
}

export default CustomDelegationsPermissionsTable
