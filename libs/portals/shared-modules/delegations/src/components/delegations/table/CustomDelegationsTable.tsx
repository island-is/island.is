import {
  Box,
  Button,
  Input,
  SkeletonLoader,
  Table as T,
  Text,
  toast,
} from '@island.is/island-ui/core'
import ExpandableRow from './ExpandableRow/ExpandableRow'
import format from 'date-fns/format'
import { useCallback, useMemo, useState } from 'react'
import { m as coreMessages } from '@island.is/portals/core'
import { useLocale } from '@island.is/localization'
import CustomDelegationsPermissionsTable from './CustomDelegationsPermissionsTable'
import { ApolloError, Reference, useApolloClient } from '@apollo/client'
import { Problem } from '@island.is/react-spa/shared'
import { AuthDomain } from '@island.is/api/schema'
import { IdentityInfo } from './IdentityInfo/IdentityInfo'
import { m } from '../../../lib/messages'
import { AuthDelegationsGroupedByIdentityOutgoingQuery } from '../../delegations/outgoing/DelegationsGroupedByIdentityOutgoing.generated'
import { useDeleteAuthDelegationMutation } from '../../access/AccessDeleteModal/AccessDeleteModal.generated'
import { useDelegationForm } from '../../../context'
import { DeleteAccessModal } from '../../modals/DeleteAccessModal'
import { DelegationPaths } from '../../../lib/paths'
import { useNavigate } from 'react-router-dom'

export type DelegationsByPerson =
  AuthDelegationsGroupedByIdentityOutgoingQuery['authDelegationsGroupedByIdentityOutgoing'][number]

const CustomDelegationsTable = ({
  title,
  data,
  loading,
  error,
  direction,
}: {
  title: string
  data: DelegationsByPerson[]
  loading: boolean
  error: ApolloError | undefined
  direction: 'outgoing' | 'incoming'
}) => {
  const { formatMessage } = useLocale()
  const client = useApolloClient()
  const [expandedRow, setExpandedRow] = useState<string | null | undefined>(
    null,
  )
  const [searchValue, setSearchValue] = useState('')
  const navigate = useNavigate()

  const [personToDelete, setPersonToDelete] =
    useState<DelegationsByPerson | null>(null)
  const {
    setSelectedScopes,

    clearForm,
  } = useDelegationForm()

  const [deleteDelegation, { loading: deleteLoading }] =
    useDeleteAuthDelegationMutation()

  const queryFieldName =
    direction === 'outgoing'
      ? 'authDelegationsGroupedByIdentityOutgoing'
      : 'authDelegationsGroupedByIdentityIncoming'

  const evictPerson = useCallback(
    (person: DelegationsByPerson) => {
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

  const handleDelete = useCallback(
    async (person: DelegationsByPerson) => {
      const delegationIds = [
        ...new Set(
          person.scopes
            .map((s) => s.delegationId)
            .filter((id): id is string => !!id),
        ),
      ]

      if (delegationIds.length === 0) return

      try {
        await Promise.all(
          delegationIds.map((delegationId) =>
            deleteDelegation({
              variables: { input: { delegationId } },
            }),
          ),
        )
        evictPerson(person)
      } catch {
        toast.error(formatMessage(coreMessages.somethingWrong))
      }
    },
    [deleteDelegation, evictPerson, formatMessage],
  )

  const headerArray = [
    { value: '' },
    { value: formatMessage(m.name) },
    { value: formatMessage(m.numberOfDelegations) },
    { value: formatMessage(m.validityPeriod) },
    ...(direction === 'outgoing' ? [{ value: '' }] : []),
    { value: '' },
  ]

  const filteredDelegations = useMemo(() => {
    if (!searchValue) {
      return data
    }

    return data.filter((person) => {
      const searchValueLower = searchValue.toLowerCase()
      const name = person.name?.toLowerCase()
      const nationalId = person.nationalId?.toLowerCase()

      return (
        name?.includes(searchValueLower) || nationalId?.includes(searchValue)
      )
    })
  }, [searchValue, data])

  const mapScopesToScopeSelection = (person: DelegationsByPerson) => {
    return person.scopes.map((scope) => ({
      name: scope.name,
      displayName: scope.displayName,
      description: scope.apiScope?.description,
      domain: scope.domain as AuthDomain,
      delegationId: scope.delegationId ?? undefined,
      validTo: scope.validTo ? new Date(scope.validTo) : undefined,
      validFrom: scope.validFrom ? new Date(scope.validFrom) : undefined,
    }))
  }

  return (
    <Box
      marginBottom={[4, 4, 6]}
      display="flex"
      flexDirection="column"
      rowGap={2}
    >
      <Box
        display="flex"
        alignItems="center"
        columnGap={2}
        justifyContent="spaceBetween"
      >
        <Text variant="h5">{title}</Text>
        {data?.length > 5 && (
          <Input
            name="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={formatMessage(m.searchPlaceholder)}
            size="xs"
            type="text"
            backgroundColor="blue"
            icon={{ name: 'search' }}
          />
        )}
      </Box>
      {loading ? (
        <Box padding={3}>
          <SkeletonLoader space={1} height={40} repeat={2} />
        </Box>
      ) : error && !data?.length ? (
        <Problem error={error} />
      ) : (
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
            {filteredDelegations?.map((person) => {
              const identity = {
                nationalId: person.nationalId,
                name: person.name,
                type: person.type,
              }

              return (
                <ExpandableRow
                  key={`${person.nationalId}-${person.type}`}
                  onExpandCallback={() =>
                    setExpandedRow(`${person.nationalId}-${person.type}`)
                  }
                  data={[
                    {
                      value: (
                        <IdentityInfo
                          identity={identity}
                          isExpanded={
                            expandedRow ===
                            `${person.nationalId}-${person.type}`
                          }
                        />
                      ),
                    },
                    {
                      value: (
                        <Text variant="medium" fontWeight="semiBold">
                          {person.totalScopeCount}
                        </Text>
                      ),
                    },
                    {
                      value: person.latestValidTo
                        ? format(new Date(person.latestValidTo), 'dd.MM.yyyy')
                        : formatMessage(m.noValidToDate),
                    },
                    ...(direction === 'outgoing'
                      ? [
                          {
                            value: (
                              <Box flexShrink={0}>
                                <Button
                                  variant="text"
                                  icon="pencil"
                                  iconType="outline"
                                  size="small"
                                  colorScheme="default"
                                  onClick={() => {
                                    const scopes =
                                      mapScopesToScopeSelection(person)
                                    setSelectedScopes(scopes)
                                    const query = new URLSearchParams({
                                      nationalId: person.nationalId ?? '',
                                    })

                                    navigate(
                                      `${
                                        DelegationPaths.DelegationsEdit
                                      }?${query.toString()}`,
                                    )
                                  }}
                                >
                                  {formatMessage(coreMessages.buttonEdit)}
                                </Button>
                              </Box>
                            ),
                            align: 'right' as const,
                          },
                        ]
                      : []),
                    {
                      value: (
                        <Box flexShrink={0}>
                          <Button
                            variant="text"
                            icon="trash"
                            iconType="outline"
                            size="small"
                            colorScheme="destructive"
                            onClick={() => {
                              const scopes = mapScopesToScopeSelection(person)
                              setSelectedScopes(scopes)
                              setPersonToDelete(person)
                            }}
                          >
                            {formatMessage(coreMessages.buttonDestroy)}
                          </Button>
                        </Box>
                      ),
                      align: 'right',
                    },
                  ]}
                >
                  <CustomDelegationsPermissionsTable
                    data={person}
                    direction={direction}
                  />
                </ExpandableRow>
              )
            })}
          </T.Body>
        </T.Table>
      )}
      <DeleteAccessModal
        isVisible={!!personToDelete}
        onClose={() => {
          setPersonToDelete(null)
          clearForm()
        }}
        onDelete={() =>
          personToDelete &&
          handleDelete(personToDelete).then(() => {
            setPersonToDelete(null)
            clearForm()
          })
        }
        loading={deleteLoading}
        otherIdentity={{
          name: personToDelete?.name ?? '',
          nationalId: personToDelete?.nationalId ?? '',
        }}
        direction={direction}
      />
    </Box>
  )
}

export default CustomDelegationsTable
