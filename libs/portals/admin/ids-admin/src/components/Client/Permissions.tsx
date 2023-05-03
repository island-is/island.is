import ContentCard from '../../shared/components/ContentCard'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { Box, Button, Table as T, Text, Icon } from '@island.is/island-ui/core'
import React, { useState } from 'react'
import AddPermissions from '../forms/AddPermissions/AddPermissions'
import { ClientFormTypes } from '../forms/EditApplication/EditApplication.action'
import { ShadowBox } from '../ShadowBox/ShadowBox'
import { mockData } from './MockPermission'

type Permission = {
  id: string
  label: string
  description: string
  api: string
  locked?: boolean
}

interface PermissionsProps {
  data?: Permission[]
}

function Permissions({ data = mockData }: PermissionsProps) {
  const { formatMessage } = useLocale()
  const [permissions, setPermissions] = useState<Permission[]>(data)
  const [addedScopes, setAddedScopes] = useState<Permission[]>([])
  const [removedScopes, setRemovedScopes] = useState<Permission[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleModalClose = () => {
    setIsModalVisible(false)
  }

  const handleModalOpen = () => {
    setIsModalVisible(true)
  }

  // If adding permissions, we want to add it to both the permissions and addedPermissions array and remove it from the removedPermissions array if it exists there
  const handleAddedPermissions = (newPermissions: Permission[]) => {
    // Add to both permissions and addedPermissions
    setAddedScopes([...addedScopes, ...newPermissions])
    setPermissions([...newPermissions])
    // Remove from removedPermissions if it exists there
    setRemovedScopes(
      removedScopes.filter(
        (removedScope) =>
          !newPermissions.some(
            (newPermission) => newPermission.id === removedScope.id,
          ),
      ),
    )
  }

  // If removing permissions, we want to remove it from both the permissions and addedPermissions array and add it to the removedPermissions array if it doesn't exist there
  const handleRemovedPermissions = (removedPermissions: Permission) => {
    // Remove from both permissions and addedPermissions
    const newPermissions = permissions.filter(
      (permission) => permission.id !== removedPermissions.id,
    )

    const newAddedSCopes = addedScopes.filter(
      (addedScope) => addedScope.id !== removedPermissions.id,
    )
    setPermissions(newPermissions)
    setAddedScopes(newAddedSCopes)
    // Add to removedPermissions if it doesn't exist there
    if (
      !removedScopes.some(
        (removedScope) => removedScope.id === removedPermissions.id,
      )
    ) {
      setRemovedScopes([...removedScopes, removedPermissions])
    }
  }

  const hasData = Array.isArray(data) && data.length > 0

  return (
    <ContentCard
      title={formatMessage(m.permissions)}
      description={formatMessage(m.permissionsDescription)}
      isDirty={addedScopes.length > 0 || removedScopes.length > 0}
      intent={ClientFormTypes.permissions}
    >
      <Box marginBottom={5}>
        <Button onClick={handleModalOpen}>
          {formatMessage(m.permissionsAdd)}
        </Button>
      </Box>
      {hasData && (
        <ShadowBox style={{ maxHeight: 440 }}>
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>
                  {formatMessage(m.permissionsTableLabelName)}
                </T.HeadData>
                <T.HeadData>
                  {formatMessage(m.permissionsTableLabelDescription)}
                </T.HeadData>
                <T.HeadData>
                  {formatMessage(m.permissionsTableLabelAPI)}
                </T.HeadData>
                <T.HeadData>{/* For matching column count */}</T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {permissions.map((item) => (
                <T.Row key={item.id}>
                  <T.Data>
                    <Box display="flex" columnGap={1} alignItems="center">
                      {item.locked && (
                        <Icon
                          type="outline"
                          icon="lockClosed"
                          size="small"
                          color="blue400"
                        />
                      )}
                      <Text variant="eyebrow">{item.label}</Text>
                    </Box>
                    {item.id}
                  </T.Data>
                  <T.Data>{item.description}</T.Data>
                  <T.Data>{item.api}</T.Data>
                  <T.Data>
                    <Button
                      onClick={() => handleRemovedPermissions(item)}
                      aria-label={formatMessage(m.permissionsButtonLabelRemove)}
                      icon="trash"
                      variant="ghost"
                      iconType="outline"
                      size="small"
                    />
                  </T.Data>
                </T.Row>
              ))}
            </T.Body>
          </T.Table>
        </ShadowBox>
      )}
      <input
        type="hidden"
        name="addedScopes"
        value={addedScopes.map((permission) => permission.id).join(',')}
      />
      <input
        type="hidden"
        name="removedScopes"
        value={removedScopes.map((permission) => permission.id).join(',')}
      />
      <AddPermissions
        handleAddPermission={handleAddedPermissions}
        handleRemovedPermissions={handleRemovedPermissions}
        onClose={handleModalClose}
        isVisible={isModalVisible}
      />
    </ContentCard>
  )
}

export default Permissions
