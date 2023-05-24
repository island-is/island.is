import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import { AuthAdminClientAllowedScope } from '@island.is/api/schema'
import {
  Box,
  Button,
  Checkbox,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getTranslatedValue } from '@island.is/portals/core'
import { Modal } from '@island.is/react/components'
import { isDefined } from '@island.is/shared/utils'

import { m } from '../../../lib/messages'
import { ShadowBox } from '../../ShadowBox/ShadowBox'
import {
  GetAvailableScopesQuery,
  useGetAvailableScopesQuery,
} from './AvailableScopes.generated'
import { useClient } from '../../Client/ClientContext'

interface AddPermissionsProps {
  isVisible: boolean
  onClose: () => void
  onAdd: (permissions: AuthAdminClientAllowedScope[]) => void
  addedScopes: AuthAdminClientAllowedScope[]
  removedScopes: AuthAdminClientAllowedScope[]
}

function AddPermissions({
  isVisible,
  onClose,
  onAdd,
  addedScopes,
  removedScopes,
}: AddPermissionsProps) {
  const { formatMessage, locale } = useLocale()
  const [selected, setSelected] = useState<
    Map<string, AuthAdminClientAllowedScope>
  >(new Map())
  const { tenant: tenantId } = useParams() as { tenant: string }

  const { selectedEnvironment } = useClient()

  const { data, loading } = useGetAvailableScopesQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        tenantId,
      },
    },
  })

  const getScopeForEnvironmentFromData = (
    data: GetAvailableScopesQuery | undefined,
  ): AuthAdminClientAllowedScope[] => {
    if (!data?.authAdminScopes?.data) {
      return []
    }
    return data.authAdminScopes?.data
      .map((item) => {
        return (
          item.environments.find(
            (scope) => scope.environment === selectedEnvironment.environment,
          ) ?? null
        )
      })
      .filter(isDefined) as AuthAdminClientAllowedScope[]
  }
  // Get the available scopes for the selected environment including the scopes that have already been deleted
  const available = getScopeForEnvironmentFromData(data)
    ?.filter((item) => {
      return ![
        ...addedScopes,
        ...(selectedEnvironment?.allowedScopes ?? []),
      ].find((added) => added.name === item.name)
    })
    .concat(removedScopes.filter(({ domainName }) => domainName === tenantId))

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

  return (
    <Modal
      label={formatMessage(m.permissionsModalTitle)}
      title={formatMessage(m.permissionsModalTitle)}
      id="add-permissions"
      isVisible={isVisible}
      onClose={onClose}
      closeButtonLabel={formatMessage(m.closeModal)}
      scrollType="outside"
    >
      <Box marginTop={1} marginBottom={4}>
        <Text>{formatMessage(m.permissionsModalDescription)}</Text>
      </Box>
      <ShadowBox isDisabled={!isVisible} flexShrink={1} overflow="auto">
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
          {!loading && (
            <T.Body>
              {available?.map((item) => (
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
          )}
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

export default AddPermissions
