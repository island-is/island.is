import {
  Box,
  Button,
  SkeletonLoader,
  Stack,
  Table as T,
  Text,
  UserAvatar,
  toast,
} from '@island.is/island-ui/core'
import ExpandableRow from './ExpandableRow/ExpandableRow'
import format from 'date-fns/format'
import { useCallback, useState } from 'react'
import { m as coreMessages, formatNationalId } from '@island.is/portals/core'
import { useLocale } from '@island.is/localization'
import { CustomDelegationsPermissionsTable } from './CustomDelegationsPermissionsTable'
import { ApolloError, Reference, useApolloClient } from '@apollo/client'
import { Problem } from '@island.is/react-spa/shared'
import { AuthDomain } from '@island.is/api/schema'
import { IdentityInfo } from './IdentityInfo/IdentityInfo'
import { m } from '../../lib/messages'
import { AuthDelegationsGroupedByIdentityOutgoingQuery } from '../delegations/outgoing/DelegationsGroupedByIdentityOutgoing.generated'
import { useDeleteAuthDelegationMutation } from '../access/AccessDeleteModal/AccessDeleteModal.generated'
import { useDelegationForm } from '../../context'
import { DeleteAccessModal } from '../modals/DeleteAccessModal'
import { DelegationPaths } from '../../lib/paths'
import { useNavigate } from 'react-router-dom'
import * as styles from './Tables.css'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import AnimateHeight from 'react-animate-height'

export type DelegationsByPerson =
  AuthDelegationsGroupedByIdentityOutgoingQuery['authDelegationsGroupedByIdentityOutgoing'][number]

export default function CustomDelegationsTable({
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
}) {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.lg
  const { formatMessage } = useLocale()
  const client = useApolloClient()
  const [expandedRow, setExpandedRow] = useState<string | null | undefined>(
    null,
  )
  const navigate = useNavigate()

  const [personToDelete, setPersonToDelete] =
    useState<DelegationsByPerson | null>(null)
  const { setSelectedScopes, setIdentities, clearForm, skipNextClear } =
    useDelegationForm()

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

  const mapScopesToScopeSelection = (person: DelegationsByPerson) => {
    return person.scopes.map((scope) => ({
      name: scope.name,
      displayName: scope.displayName,
      description: scope.apiScope?.description,
      domain: scope.domain as AuthDomain,
      delegationId: scope.delegationId ?? undefined,
      validTo: scope.validTo ? new Date(scope.validTo) : undefined,
      validFrom: scope.validFrom ? new Date(scope.validFrom) : undefined,
      allowsWrite: scope.apiScope?.allowsWrite ?? false,
    }))
  }
  const onClickEdit = (person: DelegationsByPerson) => {
    const scopes = mapScopesToScopeSelection(person)
    setSelectedScopes(scopes)

    setIdentities([
      {
        nationalId: person.nationalId ?? '',
        name: person.name ?? '',
      },
    ])
    const query = new URLSearchParams({
      nationalId: person.nationalId ?? '',
    })
    skipNextClear()

    navigate(`${DelegationPaths.DelegationsEdit}?${query.toString()}`)
  }

  const onClickDelete = (person: DelegationsByPerson) => {
    const scopes = mapScopesToScopeSelection(person)
    setSelectedScopes(scopes)
    setPersonToDelete(person)
  }

  return (
    <Box
      marginBottom={6}
      display="flex"
      flexDirection="column"
      rowGap={[0, 0, 0, 2]}
    >
      <Text variant={isMobile ? 'h4' : 'h5'}>{title}</Text>

      {loading ? (
        <Box padding={3}>
          <SkeletonLoader space={1} height={40} repeat={2} />
        </Box>
      ) : error && !data?.length ? (
        <Problem error={error} />
      ) : isMobile ? (
        <MobileCustomDelegationsTable
          data={data}
          direction={direction}
          expandedRow={expandedRow}
          setExpandedRow={setExpandedRow}
          onClickDelete={onClickDelete}
          onClickEdit={onClickEdit}
        />
      ) : (
        <DesktopCustomDelegationsTable
          data={data}
          direction={direction}
          expandedRow={expandedRow}
          setExpandedRow={setExpandedRow}
          onClickDelete={onClickDelete}
          onClickEdit={onClickEdit}
        />
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

const DesktopCustomDelegationsTable = ({
  data,
  direction,
  expandedRow,
  setExpandedRow,
  onClickDelete,
  onClickEdit,
}: {
  data: DelegationsByPerson[]
  direction: 'outgoing' | 'incoming'
  expandedRow: string | null | undefined
  setExpandedRow: (expandedRow: string | null | undefined) => void
  onClickDelete: (person: DelegationsByPerson) => void
  onClickEdit: (person: DelegationsByPerson) => void
}) => {
  const { formatMessage } = useLocale()

  const headerArray = [
    { value: '' },
    { value: formatMessage(m.name) },
    { value: formatMessage(m.numberOfDelegations) },
    { value: formatMessage(m.validityPeriod) },
    ...(direction === 'outgoing' ? [{ value: '' }] : []),
    { value: '' },
  ]

  return (
    <div className={styles.tableContainer}>
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
          {data?.map((person) => {
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
                          expandedRow === `${person.nationalId}-${person.type}`
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
                                  onClickEdit(person)
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
                            onClickDelete(person)
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
    </div>
  )
}

const MobileCustomDelegationsTable = ({
  data,
  direction,
  expandedRow,
  setExpandedRow,
  onClickDelete,
  onClickEdit,
}: {
  data: DelegationsByPerson[]
  direction: 'outgoing' | 'incoming'
  expandedRow: string | null | undefined
  setExpandedRow: (expandedRow: string | null | undefined) => void
  onClickDelete: (person: DelegationsByPerson) => void
  onClickEdit: (person: DelegationsByPerson) => void
}) => {
  const { formatMessage } = useLocale()
  return (
    <Box marginTop={1}>
      {data?.map((person) => {
        const isExpanded = expandedRow === `${person.nationalId}-${person.type}`

        return (
          <Box
            key={`${person.nationalId}-${person.type}`}
            className={styles.mobileContainer({ isExpanded })}
            paddingTop={2}
            paddingBottom={
              isExpanded ? (person.scopes.length % 2 === 0 ? 0 : 3) : 2
            }
            position="relative"
          >
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              marginBottom={1}
            >
              <Box display="flex" alignItems="center" columnGap={1}>
                <UserAvatar
                  color={isExpanded ? 'white' : 'blue'}
                  username={person.name}
                  size="medium"
                />
                <Text variant="default" fontWeight="semiBold">
                  {person.name}
                </Text>
              </Box>
              <Box marginLeft={1}>
                <Button
                  circle
                  icon={isExpanded ? 'remove' : 'add'}
                  colorScheme="light"
                  title={formatMessage(m.viewPermissions)}
                  onClick={() =>
                    setExpandedRow(
                      isExpanded ? null : `${person.nationalId}-${person.type}`,
                    )
                  }
                />
              </Box>
            </Box>

            <Box marginBottom={2}>
              <Stack space={1}>
                <Box display="flex" flexDirection="row" columnGap={1}>
                  <Box width="half" display="flex" alignItems="center">
                    <Text fontWeight="semiBold" variant="medium">
                      {formatMessage(m.nationalId)}
                    </Text>
                  </Box>
                  <Box width="half">
                    <Text variant="medium">
                      {formatNationalId(person.nationalId)}
                    </Text>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row" columnGap={1}>
                  <Box width="half" display="flex" alignItems="center">
                    <Text fontWeight="semiBold" variant="medium">
                      {formatMessage(m.numberOfDelegations)}
                    </Text>
                  </Box>
                  <Box width="half">
                    <Text variant="medium">{person.totalScopeCount}</Text>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row" columnGap={1}>
                  <Box width="half" display="flex" alignItems="center">
                    <Text fontWeight="semiBold" variant="medium">
                      {formatMessage(m.validityPeriod)}
                    </Text>
                  </Box>
                  <Box width="half">
                    <Text variant="medium">
                      {person.latestValidTo
                        ? format(new Date(person.latestValidTo), 'dd.MM.yyyy')
                        : formatMessage(m.noValidToDate)}
                    </Text>
                  </Box>
                </Box>
              </Stack>
            </Box>

            <Box display="flex" marginBottom={1} columnGap={1}>
              <Button
                variant="ghost"
                icon="trash"
                iconType="outline"
                size="small"
                colorScheme="destructive"
                fluid
                onClick={() => {
                  onClickDelete(person)
                }}
              >
                {formatMessage(coreMessages.buttonDestroy)}
              </Button>
              {direction === 'outgoing' && (
                <Button
                  variant="ghost"
                  icon="pencil"
                  iconType="outline"
                  size="small"
                  colorScheme="default"
                  fluid
                  onClick={() => onClickEdit(person)}
                >
                  {formatMessage(coreMessages.buttonEdit)}
                </Button>
              )}
            </Box>

            <AnimateHeight height={isExpanded ? 'auto' : 0} duration={300}>
              <Box paddingTop={2}></Box>
              <CustomDelegationsPermissionsTable
                data={person}
                direction={direction}
                isMobile
              />
            </AnimateHeight>
          </Box>
        )
      })}
    </Box>
  )
}
