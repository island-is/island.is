import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { GroupBase, MultiValue } from 'react-select'

import {
  AlertMessage,
  Box,
  Button,
  Icon,
  Select,
  SkeletonLoader,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getTranslatedValue } from '@island.is/portals/core'

import { usePermission } from '../PermissionContext'
import { useEnvironment } from '../../../context/EnvironmentContext'
import { useEnvironmentState } from '../../../hooks/useEnvironmentState'
import { PermissionFormTypes } from '../EditPermission.schema'
import { m } from '../../../lib/messages'
import { ShadowBox } from '../../../components/ShadowBox/ShadowBox'
import { ClientType } from '../../../components/ClientType'
import { FormCard } from '../../../components/FormCard/FormCard'
import {
  useGetScopeClientsQuery,
  useGetGrantableClientsQuery,
} from './PermissionApplications.generated'

type ScopeClient = {
  clientId: string
  clientType: string
  displayName: { value: string; locale: string }[]
  tenantId?: string
}

type ClientOption = {
  label: string
  value: string
  tenantLabel?: string
  client: ScopeClient
}

export const PermissionApplications = () => {
  const { formatMessage, locale } = useLocale()
  const { tenant } = useParams()
  const { permission, actionData } = usePermission()
  const { selectedEnvironment } = useEnvironment()

  const {
    data: scopeClientsData,
    loading: scopeClientsLoading,
    error: scopeClientsError,
  } = useGetScopeClientsQuery({
    variables: {
      input: {
        tenantId: tenant ?? '',
        scopeName: permission.scopeName,
        environment: selectedEnvironment,
      },
    },
    skip: !tenant,
    fetchPolicy: 'cache-and-network',
  })

  const initialClients: ScopeClient[] = useMemo(
    () =>
      (scopeClientsData?.authAdminScopeClients ?? []).map((c) => ({
        clientId: c.clientId,
        tenantId: c.tenantId,
        clientType: c.clientType,
        displayName: c.displayName,
      })),
    [scopeClientsData],
  )

  const [clients, setClients] =
    useEnvironmentState<ScopeClient[]>(initialClients)
  const [addedClients, setAddedClients] = useEnvironmentState<ScopeClient[]>([])
  const [removedClients, setRemovedClients] = useEnvironmentState<
    ScopeClient[]
  >([])
  const [pendingClients, setPendingClients] = useEnvironmentState<
    MultiValue<ClientOption>
  >([])
  const [hasOpened, setHasOpened] = useState(false)

  // Sync initial clients from query → table whenever the source changes
  // (e.g. on first load or after a successful save triggers a refetch).
  useEffect(() => {
    setClients(initialClients)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialClients])

  // After a successful save, clear the pending add/remove buckets.
  useEffect(() => {
    if (
      actionData?.intent === PermissionFormTypes.APPLICATIONS &&
      actionData?.data
    ) {
      setAddedClients([])
      setRemovedClients([])
      setPendingClients([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData])

  const { data: clientsData, loading: clientsLoading } =
    useGetGrantableClientsQuery({
      skip: !hasOpened,
      variables: { input: { environment: selectedEnvironment } },
    })

  const groupedOptions = useMemo<GroupBase<ClientOption>[]>(() => {
    const excluded = new Set<string>(clients.map((c) => c.clientId))

    const grantable = clientsData?.authAdminGrantableClients ?? []

    // Group flat client list by tenantId
    const byTenant = new Map<string, ClientOption[]>()
    for (const c of grantable) {
      if (excluded.has(c.clientId)) continue
      const translated = getTranslatedValue(c.displayName, locale)
      const scopeClient: ScopeClient = {
        clientId: c.clientId,
        clientType: c.clientType,
        displayName: c.displayName,
        tenantId: c.tenantId,
      }
      const option: ClientOption = {
        label: translated ? `${translated} - ${c.clientId}` : c.clientId,
        value: c.clientId,
        tenantLabel: c.tenantId,
        client: scopeClient,
      }
      const bucket = byTenant.get(c.tenantId) ?? []
      bucket.push(option)
      byTenant.set(c.tenantId, bucket)
    }

    return Array.from(byTenant.entries())
      .sort(([a], [b]) => {
        if (a === tenant) return -1
        if (b === tenant) return 1
        return a.localeCompare(b)
      })
      .map(([tenantId, options]) => ({ label: tenantId, options }))
      .filter((group) => group.options.length > 0)
  }, [clientsData, clients, tenant, locale])

  const handleAddPending = () => {
    if (pendingClients.length === 0) return
    const selected = pendingClients.map((opt) => opt.client)

    const newAdded = [...addedClients, ...selected]
    setAddedClients(
      newAdded.filter(
        (c) => !removedClients.some((r) => r.clientId === c.clientId),
      ),
    )
    setRemovedClients(
      removedClients.filter(
        (r) => !newAdded.some((added) => added.clientId === r.clientId),
      ),
    )
    setClients([...clients, ...selected])
    setPendingClients([])
  }

  const handleRemoveClient = (client: ScopeClient) => {
    setClients((prev) => prev.filter((c) => c.clientId !== client.clientId))
    setAddedClients((prev) =>
      prev.filter((c) => c.clientId !== client.clientId),
    )
    setRemovedClients((prev) => {
      // Only mark as removed if it wasn't only just added
      const wasJustAdded = addedClients.some(
        (a) => a.clientId === client.clientId,
      )
      if (wasJustAdded) return prev
      if (prev.some((c) => c.clientId === client.clientId)) return prev
      return [...prev, client]
    })
  }

  const hasData = clients.length > 0
  const isDirty = addedClients.length > 0 || removedClients.length > 0

  const customValidation = () => isDirty

  return (
    <FormCard
      title={formatMessage(m.clients)}
      description={formatMessage(m.permissionApplicationsDescription)}
      intent={PermissionFormTypes.APPLICATIONS}
      customValidation={customValidation}
      shouldSupportMultiEnvironment={false}
      headerMarginBottom={3}
    >
      <Box
        display="flex"
        columnGap={1}
        alignItems="flexStart"
        marginBottom={hasData ? 5 : 0}
      >
        <Box flexGrow={1}>
          <Select
            label={formatMessage(m.clients)}
            placeholder={formatMessage(m.permissionApplicationsPlaceholder)}
            options={groupedOptions}
            value={pendingClients}
            onChange={(value) =>
              setPendingClients(value as MultiValue<ClientOption>)
            }
            isMulti
            onMenuOpen={() => setHasOpened(true)}
            isLoading={clientsLoading}
            noOptionsMessage={formatMessage(m.permissionApplicationsNoOptions)}
            filterConfig={{
              stringify: (option) =>
                `${option.label} ${option.value} ${
                  (option.data as ClientOption).tenantLabel ?? ''
                }`,
            }}
            size="sm"
            backgroundColor="blue"
          />
        </Box>
        <Button
          variant="ghost"
          icon="add"
          onClick={handleAddPending}
          disabled={pendingClients.length === 0}
        >
          <span style={{ whiteSpace: 'nowrap' }}>
            {formatMessage(m.permissionApplicationsAdd)}
          </span>
        </Button>
      </Box>

      {scopeClientsError ? (
        <AlertMessage
          message={formatMessage(m.errorLoadingData)}
          type="error"
        />
      ) : scopeClientsLoading && clients.length === 0 ? (
        <SkeletonLoader height={120} />
      ) : hasData ? (
        <ShadowBox style={{ maxHeight: 440 }}>
          <T.Table box={{ overflow: 'initial' }}>
            <T.Head sticky>
              <T.Row>
                <T.HeadData>
                  {formatMessage(m.permissionApplicationsName)}
                </T.HeadData>
                <T.HeadData>
                  {formatMessage(m.permissionApplicationsType)}
                </T.HeadData>
                <T.HeadData>{/* trash column */}</T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {clients.map((client) => (
                <T.Row key={client.clientId}>
                  <T.Data>
                    <Box display="flex" columnGap={1} alignItems="center">
                      {client.tenantId && client.tenantId !== tenant && (
                        <Icon
                          type="outline"
                          icon="lockClosed"
                          size="small"
                          color="blue400"
                        />
                      )}
                      <Box>
                        <Text variant="eyebrow">
                          {getTranslatedValue(client.displayName, locale)}
                        </Text>
                        {client.clientId}
                      </Box>
                    </Box>
                  </T.Data>
                  <T.Data>
                    <ClientType client={{ clientType: client.clientType }} />
                  </T.Data>
                  <T.Data>
                    <Box display="flex" justifyContent="flexEnd">
                      <Button
                        onClick={() => handleRemoveClient(client)}
                        aria-label={formatMessage(
                          m.permissionApplicationsRemove,
                        )}
                        icon="trash"
                        variant="ghost"
                        iconType="outline"
                        size="small"
                      />
                    </Box>
                  </T.Data>
                </T.Row>
              ))}
            </T.Body>
          </T.Table>
        </ShadowBox>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          padding={4}
          borderRadius="large"
          background="blue100"
          marginTop={3}
        >
          <Text>{formatMessage(m.permissionApplicationsEmpty)}</Text>
        </Box>
      )}

      <input
        type="hidden"
        name="addedScopeClientIds"
        value={JSON.stringify(addedClients.map((c) => c.clientId))}
      />
      <input
        type="hidden"
        name="removedScopeClientIds"
        value={JSON.stringify(removedClients.map((c) => c.clientId))}
      />
    </FormCard>
  )
}
