import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import { useParams } from 'react-router-dom'
import type { GroupBase, MultiValue } from 'react-select'

import { AuthAdminClientAllowedScope } from '@island.is/api/schema'
import {
  Box,
  Button,
  Icon,
  Select,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getTranslatedValue } from '@island.is/portals/core'
import { isDefined } from '@island.is/shared/utils'

import { m } from '../../../lib/messages'
import { ClientFormTypes } from '../EditClient.schema'
import { ShadowBox } from '../../../components/ShadowBox/ShadowBox'
import { useEnvironmentState } from '../../../hooks/useEnvironmentState'
import { useClient } from '../ClientContext'
import { FormCard } from '../../../components/FormCard/FormCard'
import { useTenantsQuery } from '../../Tenants/Tenants.generated'
import { useGetAvailableScopesByTenantsQuery } from './Permissions.generated'

interface PermissionsProps {
  allowedScopes?: AuthAdminClientAllowedScope[]
}

type ScopeOption = {
  label: string
  value: string
  description?: string
  tenantLabel?: string
}

type TenantScopes = {
  tenantId: string
  tenantLabel: string
  scopes: AuthAdminClientAllowedScope[]
}

const Permissions = ({ allowedScopes }: PermissionsProps) => {
  const { formatMessage, locale } = useLocale()
  const { tenant } = useParams()
  const {
    selectedEnvironment: { environment },
    actionData,
  } = useClient()

  const [permissions, setPermissions] = useEnvironmentState<
    AuthAdminClientAllowedScope[]
  >(allowedScopes ?? [])
  const [addedScopes, setAddedScopes] = useEnvironmentState<
    AuthAdminClientAllowedScope[]
  >([])
  const [removedScopes, setRemovedScopes] = useEnvironmentState<
    AuthAdminClientAllowedScope[]
  >([])
  const [pendingScopes, setPendingScopes] = useEnvironmentState<
    MultiValue<ScopeOption>
  >([])
  const [hasOpened, setHasOpened] = useState(false)

  const { data: tenantsData, loading: tenantsLoading } = useTenantsQuery({
    skip: !hasOpened,
  })

  useEffect(() => {
    if (
      actionData?.intent === ClientFormTypes.permissions &&
      actionData?.data
    ) {
      setAddedScopes([])
      setRemovedScopes([])
    }
  }, [actionData, setAddedScopes, setRemovedScopes])

  const availableTenants = useMemo(() => {
    const tenants = tenantsData?.authAdminTenants?.data ?? []
    return tenants.filter((t) => t.availableEnvironments.includes(environment))
  }, [tenantsData, environment])

  const tenantLabels = useMemo(() => {
    const map = new Map<string, string>()
    for (const t of availableTenants) {
      map.set(t.id, getTranslatedValue(t.defaultEnvironment.displayName, locale))
    }
    return map
  }, [availableTenants, locale])

  const { data: scopesData, loading: scopesLoading } =
    useGetAvailableScopesByTenantsQuery({
      skip: !hasOpened || availableTenants.length === 0,
      variables: { input: { tenantIds: availableTenants.map((t) => t.id) } },
    })

  const tenantScopes = useMemo<TenantScopes[]>(() => {
    const groups = scopesData?.authAdminScopesByTenants?.data ?? []
    return groups.flatMap((group) => {
      const tenantLabel = tenantLabels.get(group.tenantId)
      if (!tenantLabel) return []
      const scopes = group.data
        .map((scope) =>
          scope.environments.find((e) => e.environment === environment),
        )
        .filter(isDefined) as AuthAdminClientAllowedScope[]
      return [{ tenantId: group.tenantId, tenantLabel, scopes }]
    })
  }, [scopesData, tenantLabels, environment])

  const scopePool = useMemo(() => {
    const map = new Map<string, AuthAdminClientAllowedScope>()
    for (const group of tenantScopes) {
      for (const scope of group.scopes) {
        map.set(scope.name, scope)
      }
    }
    for (const scope of removedScopes) {
      if (!map.has(scope.name)) map.set(scope.name, scope)
    }
    return map
  }, [tenantScopes, removedScopes])

  const groupedOptions = useMemo<GroupBase<ScopeOption>[]>(() => {
    const excluded = new Set<string>(permissions.map((p) => p.name))

    const groupMap = new Map<
      string,
      { label: string; scopes: Map<string, AuthAdminClientAllowedScope> }
    >()

    for (const group of tenantScopes) {
      const scopeMap = new Map<string, AuthAdminClientAllowedScope>()
      for (const scope of group.scopes) {
        scopeMap.set(scope.name, scope)
      }
      groupMap.set(group.tenantId, {
        label: group.tenantLabel,
        scopes: scopeMap,
      })
    }

    const OTHER_GROUP_KEY = '__other__'
    for (const scope of removedScopes) {
      const tenantId =
        scope.domainName && groupMap.has(scope.domainName)
          ? scope.domainName
          : OTHER_GROUP_KEY
      let entry = groupMap.get(tenantId)
      if (!entry) {
        entry = {
          label: formatMessage(m.permissionsOtherTenantGroup),
          scopes: new Map(),
        }
        groupMap.set(tenantId, entry)
      }
      if (!entry.scopes.has(scope.name)) {
        entry.scopes.set(scope.name, scope)
      }
    }

    const toOption = (
      scope: AuthAdminClientAllowedScope,
      tenantLabel: string,
    ): ScopeOption => ({
      label: `${getTranslatedValue(scope.displayName, locale)} - ${scope.name}`,
      value: scope.name,
      description: getTranslatedValue(scope.description ?? [], locale),
      tenantLabel,
    })

    const entries = Array.from(groupMap.entries())
    entries.sort(([aId], [bId]) => {
      if (aId === tenant) return -1
      if (bId === tenant) return 1
      return 0
    })

    return entries
      .map(([, group]) => ({
        label: group.label,
        options: Array.from(group.scopes.values())
          .filter((scope) => !excluded.has(scope.name))
          .map((scope) => toOption(scope, group.label)),
      }))
      .filter((group) => group.options.length > 0)
  }, [tenantScopes, permissions, removedScopes, locale, tenant, formatMessage])

  const handleRemovedPermission = (
    removedPermission: AuthAdminClientAllowedScope,
  ) => {
    setAddedScopes((prevState) =>
      prevState.filter((item) => item.name !== removedPermission.name),
    )
    setPermissions((prevState) =>
      prevState.filter((item) => item.name !== removedPermission.name),
    )

    setRemovedScopes((prevState) => {
      if (
        [...addedScopes, ...prevState].find(
          (item) => item.name === removedPermission.name,
        )
      ) {
        return prevState
      }
      return [...prevState, removedPermission]
    })
  }

  const handleAddPending = () => {
    const selected = pendingScopes
      .map((opt) => scopePool.get(opt.value))
      .filter(isDefined)

    if (selected.length === 0) return

    const newAddedScopes = [...addedScopes, ...selected]

    setAddedScopes(
      newAddedScopes.filter(
        (item) => !removedScopes.some((rem) => rem.name === item.name),
      ),
    )
    setRemovedScopes(
      removedScopes.filter(
        (item) => !newAddedScopes.find((added) => added.name === item.name),
      ),
    )

    setPermissions([...permissions, ...selected])
    setPendingScopes([])
  }

  const hasData =
    permissions.length > 0 || addedScopes.length > 0 || removedScopes.length > 0

  const customValidation = useCallback(
    () =>
      addedScopes.length > 0 ||
      removedScopes.length > 0 ||
      pendingScopes.length > 0,
    [addedScopes, removedScopes, pendingScopes],
  )

  // Commit any pending multi-select selections into addedScopes synchronously
  // so the hidden inputs are in the DOM before react-router serializes the form.
  const handleSubmit = () => {
    if (pendingScopes.length === 0) return
    flushSync(() => {
      handleAddPending()
    })
  }

  return (
    <FormCard
      title={formatMessage(m.permissions)}
      description={formatMessage(m.permissionsDescription, {
        br: <br />,
      })}
      customValidation={customValidation}
      onSubmit={handleSubmit}
      intent={
        hasData || pendingScopes.length > 0
          ? ClientFormTypes.permissions
          : undefined
      }
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
            label={formatMessage(m.permissions)}
            placeholder={formatMessage(m.permissionsAdd)}
            options={groupedOptions}
            value={pendingScopes}
            onChange={(value) =>
              setPendingScopes(value as MultiValue<ScopeOption>)
            }
            isMulti
            onMenuOpen={() => setHasOpened(true)}
            isLoading={tenantsLoading || scopesLoading}
            noOptionsMessage={formatMessage(m.permissionsModalNoScopes)}
            filterConfig={{
              stringify: (option) =>
                `${option.label} ${option.value} ${
                  (option.data as ScopeOption).tenantLabel ?? ''
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
          disabled={pendingScopes.length === 0}
          dataTestId="add-permissions-button"
        >
          <span style={{ whiteSpace: 'nowrap' }}>
            {formatMessage(m.permissionsAdd)}
          </span>
        </Button>
      </Box>
      {hasData && (
        <ShadowBox style={{ maxHeight: 440 }}>
          <T.Table box={{ overflow: 'initial' }}>
            <T.Head sticky>
              <T.Row>
                <T.HeadData>
                  {formatMessage(m.permissionsTableLabelName)}
                </T.HeadData>
                <T.HeadData>
                  {formatMessage(m.permissionsTableLabelDescription)}
                </T.HeadData>
                <T.HeadData>{/* For matching column count */}</T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {permissions.map((item) => (
                <T.Row key={item.name} dataTestId="permission-row">
                  <T.Data>
                    <Box display="flex" columnGap={1} alignItems="center">
                      {item.domainName !== tenant && (
                        <Icon
                          type="outline"
                          icon="lockClosed"
                          size="small"
                          color="blue400"
                        />
                      )}
                      <Text variant="eyebrow">
                        {getTranslatedValue(item.displayName, locale)}
                      </Text>
                    </Box>
                    {item.name}
                  </T.Data>
                  <T.Data>
                    {getTranslatedValue(item.description ?? [], locale)}
                  </T.Data>
                  <T.Data>
                    <Box display="flex" justifyContent="flexEnd">
                      <Button
                        onClick={() => handleRemovedPermission(item)}
                        aria-label={formatMessage(
                          m.permissionsButtonLabelRemove,
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
      )}
      {addedScopes.map(({ name }) => (
        <input key={name} type="hidden" name="addedScopes" value={name} />
      ))}
      {removedScopes.map(({ name }) => (
        <input key={name} type="hidden" name="removedScopes" value={name} />
      ))}
    </FormCard>
  )
}

export default Permissions
