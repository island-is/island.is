import React, { useEffect, useState } from 'react'
import { useFetcher, useParams } from 'react-router-dom'

import { AuthAdminClientAllowedScope } from '@island.is/api/schema'
import {
  Box,
  Button,
  Checkbox,
  Option,
  Select,
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

type AuthAdminScopes = GetAvailableScopesQuery['authAdminScopes']['data'][0]['environments']

interface AddPermissionsProps {
  isVisible: boolean
  onClose: () => void
  onAdd: (permissions: AuthAdminClientAllowedScope[]) => void
  addedScopes: AuthAdminClientAllowedScope[]
  removedScopes: AuthAdminClientAllowedScope[]
}

const formatOption = (tenant: AuthTenants[0], locale: string) =>
  ({
    label: getTranslatedValue(tenant.defaultEnvironment.displayName, locale),
    value: tenant.id,
  } as Option)

export const AddPermissions = ({
  isVisible,
  onClose,
  onAdd,
  addedScopes,
}: AddPermissionsProps) => {
  const { formatMessage, locale } = useLocale()
  const { tenant } = useParams()
  const { md } = useBreakpoint()
  const {
    selectedEnvironment: { environment, allowedScopes },
  } = useClient()
  const fetcher = useFetcher()
  const [selectedTenant, setSelectedTenant] = useState<Option>()
  const [availableTenants, setAvailableTenants] = useState<AuthTenants>([])
  const [availableScopes, setAvailableScopes] = useState<AuthAdminScopes>([])

  const [
    getAvailableScopesQuery,
    { data: { authAdminScopes } = { authAdminScopes: undefined }, loading },
  ] = useGetAvailableScopesLazyQuery({
    fetchPolicy: 'network-only',
  })

  const [selected, setSelected] = useState<
    Map<string, AuthAdminClientAllowedScope>
  >(new Map())

  useEffect(() => {
    if (fetcher.state === 'idle' && !fetcher.data) {
      fetcher.load(IDSAdminPaths.IDSAdmin)
    }
  }, [fetcher])

  useEffect(() => {
    if (fetcher.data) {
      // When fetcher has loaded data we filter available tenants for the selected environment
      const availableTenants = (fetcher.data as AuthTenants).filter((tenant) =>
        tenant.availableEnvironments.find(
          (availableEnvironment) => availableEnvironment === environment,
        ),
      )
      // Populate the available tenants state for dropdown values
      setAvailableTenants(availableTenants)

      // Find the selected tenant based on the tenant router param
      const selectedTenant = availableTenants.find((t) => t.id === tenant)

      if (selectedTenant) {
        setSelectedTenant(formatOption(selectedTenant, locale))
        getAvailableScopesQuery({
          variables: {
            input: {
              tenantId: selectedTenant.id,
            },
          },
        })
      }
    }
  }, [fetcher.data, locale])

  useEffect(() => {
    if (authAdminScopes?.data) {
      // When scope data is queried we need to filter it for the selected environment
      // and remove already added or allowed scopes.
      setAvailableScopes(
        authAdminScopes.data
          .map((scope) =>
            scope.environments.find((e) => e.environment === environment),
          )
          .filter(isDefined)
          .filter(
            (scope) =>
              scope &&
              ![...addedScopes, ...(allowedScopes ?? [])].find(
                (s) => s.name === scope.name,
              ),
          ),
      )
    }
  }, [authAdminScopes?.data])

  // Add the selected scopes to the addedScopes array for
  const handleAdd = () => {
    // Add the new scopes to the permissions array
    onAdd([...selected.values()])

    // Reset the selected scopes
    setSelected(new Map())

    // Close the modal
    onClose()
  }

  // Handle checkbox change
  const onChange = (value: AuthAdminClientAllowedScope) => {
    if (selected.has(value.name)) {
      selected.delete(value.name)
    } else {
      selected.set(value.name, value)
    }
    setSelected(new Map(selected))
  }

  const handleTenantChange = (opt: Option) => {
    setSelectedTenant(opt)

    getAvailableScopesQuery({
      variables: {
        input: {
          tenantId: opt.value as string,
        },
      },
    })
  }

  return (
    <Modal
      label={formatMessage(m.permissionsModalTitle)}
      title={formatMessage(m.permissionsModalTitle)}
      id="add-permissions"
      isVisible={isVisible}
      onClose={onClose}
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
          onChange={(opt) => handleTenantChange(opt as Option)}
          value={selectedTenant}
          options={availableTenants.map((tenant) =>
            formatOption(tenant, locale),
          )}
        />
      </Box>

      <ShadowBox flexShrink={1} overflow="auto">
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>{/* For matching column count */}</T.HeadData>
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
                      onChange={() => {
                        onChange(item as AuthAdminClientAllowedScope)
                      }}
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
          </T.Body>
        </T.Table>
      </ShadowBox>

      <Box display="flex" justifyContent="spaceBetween" marginTop={2}>
        <Button onClick={onClose} variant="ghost">
          {formatMessage(m.cancel)}
        </Button>
        <Button onClick={handleAdd}>{formatMessage(m.add)}</Button>
      </Box>
    </Modal>
  )
}
