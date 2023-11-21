import React, { useEffect, useState } from 'react'
import { useFetcher, useParams } from 'react-router-dom'
import { SingleValue } from 'react-select'

import { AuthAdminClientAllowedScope } from '@island.is/api/schema'
import {
  Box,
  Button,
  Checkbox,
  StringOption as Option,
  Select,
  SkeletonLoader,
  Table as T,
  Text,
  useBreakpoint,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getTranslatedValue } from '@island.is/portals/core'
import { Modal } from '@island.is/react/components'
import { isDefined } from '@island.is/shared/utils'

import { ShadowBox } from '../../../../components/ShadowBox/ShadowBox'
import { m } from '../../../../lib/messages'
import { IDSAdminPaths } from '../../../../lib/paths'
import { AuthTenants } from '../../../Tenants/Tenants.loader'
import { useClient } from '../../ClientContext'
import {
  GetAvailableScopesQuery,
  useGetAvailableScopesLazyQuery,
} from './AddPermissions.generated'

import * as styles from './AddPermissions.css'

type AuthAdminScope =
  GetAvailableScopesQuery['authAdminScopes']['data'][0]['environments'][0]

interface AddPermissionsProps {
  isVisible: boolean
  onClose(): void
  onAdd(permissions: AuthAdminClientAllowedScope[]): void
  addedScopes: AuthAdminClientAllowedScope[]
  removedScopes: AuthAdminClientAllowedScope[]
}

const formatOption = (tenant: AuthTenants[0], locale: string): Option => ({
  label: getTranslatedValue(tenant.defaultEnvironment.displayName, locale),
  value: tenant.id,
})

export const AddPermissions = ({
  isVisible,
  onClose,
  onAdd,
  addedScopes,
  removedScopes,
}: AddPermissionsProps) => {
  const { formatMessage, locale } = useLocale()
  const { tenant } = useParams()
  const { md } = useBreakpoint()
  const {
    selectedEnvironment: { environment, allowedScopes },
  } = useClient()
  const fetcher = useFetcher()
  const tenants = fetcher.data
  const [selectedTenant, setSelectedTenant] = useState<Option | null>(null)
  const [availableTenants, setAvailableTenants] = useState<AuthTenants>([])
  const [availableScopes, setAvailableScopes] = useState<AuthAdminScope[]>([])
  // Ignored scopes are scopes that the user has already added or the client has already been granted
  const ignoredScopes = [...addedScopes, ...(allowedScopes ?? [])]

  const [
    getAvailableScopesQuery,
    { data: { authAdminScopes } = { authAdminScopes: undefined }, loading },
  ] = useGetAvailableScopesLazyQuery()

  const fetchAvailableScopes = (tenantId: string) => {
    getAvailableScopesQuery({
      variables: {
        input: {
          tenantId,
        },
      },
    })
  }

  const setDefaultTenant = (availableTenants: AuthTenants) => {
    // Find the selected tenant based on the tenant router param
    const selectedTenant = availableTenants.find((t) => t.id === tenant)

    if (selectedTenant) {
      setSelectedTenant(formatOption(selectedTenant, locale))
      fetchAvailableScopes(selectedTenant.id)
    }
  }

  const [selectedScopes, setSelectedScopes] = useState<
    Map<string, AuthAdminClientAllowedScope>
  >(new Map())

  useEffect(() => {
    if (fetcher.state === 'idle' && !tenants) {
      fetcher.load(IDSAdminPaths.IDSAdmin)
    }
  }, [fetcher])

  useEffect(() => {
    if (tenants) {
      // When fetcher has loaded data we filter available tenants for the selected environment
      const availableTenants = (tenants as AuthTenants).filter((tenant) =>
        tenant.availableEnvironments.find(
          (availableEnvironment) => availableEnvironment === environment,
        ),
      )
      // Populate the available tenants state for dropdown values
      setAvailableTenants(availableTenants)

      setDefaultTenant(availableTenants)
    }
  }, [tenants, locale])

  useEffect(() => {
    if (authAdminScopes?.data) {
      // When scope data is queried we need to filter it for the selected environment and remove ignoredScopes
      setAvailableScopes(
        authAdminScopes.data
          .map((scope) =>
            scope.environments.find((e) => e.environment === environment),
          )
          .filter(isDefined)
          .filter((scope) => !ignoredScopes.find((s) => s.name === scope.name))
          .concat(
            removedScopes.map((s) => ({ ...s, environment } as AuthAdminScope)),
          ),
      )
    }
  }, [authAdminScopes?.data, addedScopes, allowedScopes])

  const handleClose = () => {
    // Reset the selected scopes
    selectedScopes.clear()

    // Restore the selected tenant to default
    setDefaultTenant(availableTenants)

    // Close the modal
    onClose()
  }

  // Add the selected scopes to the addedScopes array for
  const handleAdd = () => {
    // Add the new scopes to the permissions array
    onAdd([...selectedScopes.values()])

    handleClose()
  }

  const onCheckboxChange = (value: AuthAdminClientAllowedScope) => {
    if (selectedScopes.has(value.name)) {
      selectedScopes.delete(value.name)
    } else {
      selectedScopes.set(value.name, value)
    }
    setSelectedScopes(new Map(selectedScopes))
  }

  const handleTenantChange = (opt: SingleValue<Option>) => {
    setSelectedTenant(opt)
    if (opt) {
      fetchAvailableScopes(opt.value)
    }
  }

  return (
    <Modal
      label={formatMessage(m.permissionsModalTitle)}
      title={formatMessage(m.permissionsModalTitle)}
      id="add-permissions"
      isVisible={isVisible}
      onClose={handleClose}
      closeButtonLabel={formatMessage(m.closeModal)}
      scrollType="inside"
    >
      <Box marginTop={1} marginBottom={4}>
        <Text>{formatMessage(m.permissionsModalDescription)}</Text>
      </Box>

      <Box
        marginBottom={3}
        className={md ? styles.dropdownContainer : undefined}
      >
        <Select
          name="tenant"
          size="sm"
          backgroundColor="blue"
          label={formatMessage(m.tenant)}
          onChange={(opt) => handleTenantChange(opt)}
          value={selectedTenant}
          options={availableTenants.map((tenant) =>
            formatOption(tenant, locale),
          )}
        />
      </Box>

      <ShadowBox flexShrink={1} overflow="auto">
        <Box display="flex" flexDirection="column" style={{ minHeight: 250 }}>
          <T.Table>
            <T.Head>
              <T.Row>
                {/* For matching column count */}
                <T.HeadData />
                <T.HeadData>
                  {formatMessage(m.permissionsTableLabelName)}
                </T.HeadData>
                <T.HeadData>
                  {formatMessage(m.permissionsTableLabelDescription)}
                </T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {!loading &&
                availableScopes.map((item) => (
                  <T.Row key={item.name}>
                    <T.Data>
                      <Checkbox
                        onChange={() =>
                          onCheckboxChange(item as AuthAdminClientAllowedScope)
                        }
                        checked={selectedScopes.has(item.name)}
                        value={item.name}
                      />
                    </T.Data>
                    <T.Data>
                      <Text variant="eyebrow">
                        {getTranslatedValue(item.displayName, locale)}
                      </Text>
                      {item.name}
                    </T.Data>
                    <T.Data>
                      {getTranslatedValue(item.description ?? [], locale)}
                    </T.Data>
                  </T.Row>
                ))}
              {loading && (
                <T.Row>
                  <T.Data />
                  <T.Data>
                    <SkeletonLoader height={25} />
                  </T.Data>
                  <T.Data>
                    <SkeletonLoader height={25} />
                  </T.Data>
                </T.Row>
              )}
            </T.Body>
          </T.Table>
          {availableScopes.length === 0 && (
            <Box margin="auto">
              <Text>{formatMessage(m.permissionsModalNoScopes)}</Text>
            </Box>
          )}
        </Box>
      </ShadowBox>

      <Box display="flex" justifyContent="spaceBetween" marginTop={2}>
        <Button onClick={handleClose} variant="ghost">
          {formatMessage(m.cancel)}
        </Button>
        <Button onClick={handleAdd}>{formatMessage(m.add)}</Button>
      </Box>
    </Modal>
  )
}
