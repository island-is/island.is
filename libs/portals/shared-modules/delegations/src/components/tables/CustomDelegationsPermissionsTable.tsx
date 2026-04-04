import {
  Box,
  Button,
  DatePicker,
  Icon,
  Link,
  Stack,
  Table as T,
  Text,
  toast,
} from '@island.is/island-ui/core'
import format from 'date-fns/format'
import { AuthDelegationsGroupedByIdentityOutgoingQuery } from '../../components/delegations/outgoing/DelegationsGroupedByIdentityOutgoing.generated'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { m as coreMessages } from '@island.is/portals/core'

import { useState } from 'react'
import { Reference, useApolloClient } from '@apollo/client'
import { ScopeSelection, useDelegationForm } from '../../context'
import { AuthDelegationScope, AuthDomain } from '@island.is/api/schema'
import { DeleteAccessModal } from '../modals/DeleteAccessModal'
import { usePatchAuthDelegationMutation } from '../../screens/EditAccess.tsx/EditAccess.generated'
import * as styles from './Tables.css'

type PersonCentricDelegation =
  AuthDelegationsGroupedByIdentityOutgoingQuery['authDelegationsGroupedByIdentityOutgoing'][number]
type Scope = PersonCentricDelegation['scopes'][number]

export const CustomDelegationsPermissionsTable = ({
  data,
  direction,
  isMobile,
}: {
  data: PersonCentricDelegation
  direction: 'outgoing' | 'incoming'
  isMobile?: boolean
}) => {
  const { formatMessage } = useLocale()
  const client = useApolloClient()
  const scopes = data.scopes

  const [patchDelegation, { loading: patchLoading }] =
    usePatchAuthDelegationMutation()

  const { setSelectedScopes, clearForm } = useDelegationForm()

  const [scopeToDelete, setScopeToDelete] = useState<Scope | null>(null)

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
          const scopeId = cache.identify({
            __typename: 'AuthDelegationScope',
            id: scope.id,
          })
          if (scopeId) {
            cache.modify({
              id: scopeId,
              fields: {
                validTo() {
                  return newDate.toISOString()
                },
              },
            })
          }
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
    <>
      {isMobile ? (
        <MobileCustomDelegationsPermissionsTable
          scopes={scopes}
          subjectId={data.subjectId}
          direction={direction}
          handleDateChange={handleDateChange}
          setScopeToDelete={setScopeToDelete}
          setSelectedScopes={setSelectedScopes}
        />
      ) : (
        <DesktopCustomDelegationsPermissionsTable
          scopes={scopes}
          subjectId={data.subjectId}
          direction={direction}
          handleDateChange={handleDateChange}
          setScopeToDelete={setScopeToDelete}
          setSelectedScopes={setSelectedScopes}
        />
      )}
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
          handleDeleteScope(delegationId, scopeName).then(() => {
            clearForm()
          })
        }}
        loading={patchLoading}
      />
    </>
  )
}

const DesktopCustomDelegationsPermissionsTable = ({
  scopes,
  subjectId,
  direction,
  handleDateChange,
  setScopeToDelete,
  setSelectedScopes,
}: {
  scopes: Scope[]
  subjectId: string | null | undefined
  direction: 'outgoing' | 'incoming'
  handleDateChange: (scope: Scope, newDate: Date) => void
  setScopeToDelete: (scope: Scope) => void
  setSelectedScopes: (scopes: ScopeSelection[]) => void
}) => {
  const { formatMessage } = useLocale()
  const headerArray = [
    { value: formatMessage(m.headerDomain) },
    { value: formatMessage(m.headerScopeName) },
    { value: formatMessage(m.headerRegisteredDate) },
    { value: formatMessage(m.headerValidityPeriod) },
    // { value: 'Síðast notað' }, // TODO: Data not available yet
    { value: '' },
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
          {scopes?.map((scope) => {
            const hasThirdPartyLoginUrl = !!scope.apiScope?.thirdPartyLoginUrl
            const hasSubjectId = !!subjectId
            const thirdPartyLoginUrl =
              hasThirdPartyLoginUrl && hasSubjectId
                ? scope.apiScope?.thirdPartyLoginUrl?.replace(
                    '{{subjectId}}',
                    subjectId,
                  )
                : undefined
            return (
              <T.Row key={scope.id}>
                <T.Data style={{ paddingInline: 16, wordBreak: 'break-word' }}>
                  <Text variant="medium">{scope.domain?.displayName}</Text>
                </T.Data>
                <T.Data style={{ paddingInline: 16, wordBreak: 'break-word' }}>
                  <Text variant="medium">{scope.displayName}</Text>
                </T.Data>
                <T.Data style={{ paddingInline: 16 }}>
                  <Text variant="medium">
                    {scope.validFrom
                      ? format(new Date(scope.validFrom), 'dd.MM.yyyy')
                      : '-'}
                  </Text>
                </T.Data>
                <T.Data style={{ paddingInline: 16, maxWidth: 180 }}>
                  {direction === 'incoming' ? (
                    <Text variant="medium">
                      {scope.validTo
                        ? format(new Date(scope.validTo), 'dd.MM.yyyy')
                        : '-'}
                    </Text>
                  ) : (
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
                      detachedCalendar={true}
                    />
                  )}
                </T.Data>
                <T.Data style={{ paddingInline: 16 }}>
                  <Box display="flex" justifyContent="flexEnd">
                    <Box flexShrink={0}>
                      {direction === 'incoming' && thirdPartyLoginUrl && (
                        <Link href={thirdPartyLoginUrl} className={styles.link}>
                          <Text
                            variant="small"
                            color="currentColor"
                            fontWeight="semiBold"
                          >
                            {formatMessage(m.switch)}
                          </Text>
                          <Icon icon="person" type="outline" size="small" />
                        </Link>
                      )}
                    </Box>
                  </Box>
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
                              allowsWrite: scope.apiScope?.allowsWrite ?? false,
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
    </div>
  )
}

const MobileCustomDelegationsPermissionsTable = ({
  scopes,
  direction,
  handleDateChange,
  setScopeToDelete,
  setSelectedScopes,
  subjectId,
}: {
  scopes: Scope[]
  direction: 'outgoing' | 'incoming'
  handleDateChange: (scope: Scope, newDate: Date) => void
  setScopeToDelete: (scope: Scope) => void
  setSelectedScopes: (scopes: ScopeSelection[]) => void
  subjectId: string | null | undefined
}) => {
  const { formatMessage } = useLocale()
  return (
    <Box>
      {scopes?.map((scope, idx) => {
        const hasThirdPartyLoginUrl = !!scope.apiScope?.thirdPartyLoginUrl
        const hasSubjectId = !!subjectId
        const thirdPartyLoginUrl =
          hasThirdPartyLoginUrl && hasSubjectId
            ? scope.apiScope?.thirdPartyLoginUrl?.replace(
                '{{subjectId}}',
                subjectId,
              )
            : undefined

        return (
          <Box
            key={scope.id}
            paddingX={1}
            paddingTop={2}
            paddingBottom={3}
            background={idx % 2 === 0 ? 'white' : 'transparent'}
          >
            <Box marginBottom={1}>
              <Text variant="h5">
                {formatMessage(m.delegationNr, { index: idx + 1 })}
              </Text>
            </Box>
            <Box>
              <Stack space={0}>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Box
                    width="half"
                    display="flex"
                    alignItems="center"
                    paddingY={1}
                  >
                    <Text fontWeight="semiBold" variant="medium">
                      {formatMessage(m.headerDomain)}
                    </Text>
                  </Box>
                  <Box width="half">
                    <Text variant="medium">{scope.domain?.displayName}</Text>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Box
                    width="half"
                    display="flex"
                    alignItems="center"
                    paddingY={1}
                  >
                    <Text fontWeight="semiBold" variant="medium">
                      {formatMessage(m.headerScopeName)}
                    </Text>
                  </Box>
                  <Box width="half">
                    <Text variant="medium">{scope.displayName}</Text>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Box
                    width="half"
                    display="flex"
                    alignItems="center"
                    paddingY={1}
                  >
                    <Text fontWeight="semiBold" variant="medium">
                      {formatMessage(m.headerRegisteredDate)}
                    </Text>
                  </Box>
                  <Box width="half">
                    <Text variant="medium">
                      {scope.validFrom
                        ? format(new Date(scope.validFrom), 'dd.MM.yyyy')
                        : '-'}
                    </Text>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Box
                    width="half"
                    display="flex"
                    alignItems="center"
                    paddingY={1}
                  >
                    <Text fontWeight="semiBold" variant="medium">
                      {formatMessage(m.headerValidityPeriod)}
                    </Text>
                  </Box>
                  <Box width="half">
                    {direction === 'incoming' ? (
                      <Text variant="medium">
                        {scope.validTo
                          ? format(new Date(scope.validTo), 'dd.MM.yyyy')
                          : '-'}
                      </Text>
                    ) : (
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
                        detachedCalendar={true}
                      />
                    )}
                  </Box>
                </Box>
                <Box>
                  {direction === 'incoming' && thirdPartyLoginUrl && (
                    <Link
                      href={thirdPartyLoginUrl}
                      className={styles.linkMobile}
                    >
                      <Text
                        variant="medium"
                        color="currentColor"
                        fontWeight="semiBold"
                      >
                        {formatMessage(m.switch)}
                      </Text>
                      <Icon icon="person" type="outline" size="small" />
                    </Link>
                  )}
                </Box>
                <Box display="flex" paddingTop={2}>
                  <Button
                    variant="ghost"
                    icon="trash"
                    iconType="outline"
                    size="small"
                    colorScheme="destructive"
                    fluid
                    onClick={() => {
                      setScopeToDelete(scope as AuthDelegationScope)
                      setSelectedScopes([
                        {
                          name: scope.name,
                          displayName: scope.displayName,
                          description: scope.apiScope?.description,
                          domain: scope.domain as AuthDomain,
                          delegationId: scope.delegationId ?? undefined,
                          allowsWrite: scope.apiScope?.allowsWrite ?? false,
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
              </Stack>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
