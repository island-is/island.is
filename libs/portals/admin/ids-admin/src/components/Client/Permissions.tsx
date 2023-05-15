import ContentCard from '../../shared/components/ContentCard'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { Box, Button, Icon, Table as T, Text } from '@island.is/island-ui/core'
import React, { useContext, useState } from 'react'
import { ClientFormTypes } from '../forms/EditApplication/EditApplication.action'
import { ShadowBox } from '../ShadowBox/ShadowBox'
import { useParams } from 'react-router-dom'
import { ClientContext } from '../../shared/context/ClientContext'
import { AuthAdminClientAllowedScope } from '@island.is/api/schema'
import AddPermissions from '../forms/AddPermissions/AddPermissions'
import { getTranslatedValue } from '@island.is/portals/core'

interface PermissionsProps {
  allowedScopes?: AuthAdminClientAllowedScope[] | undefined
}

function Permissions({ allowedScopes }: PermissionsProps) {
  const { formatMessage, locale } = useLocale()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const params = useParams()
  const [permissions, setPermissions] = useState<AuthAdminClientAllowedScope[]>(
    allowedScopes ?? [],
  )
  const {
    addedScopes,
    removedScopes,
    setRemovedScopes,
    setAddedScopes,
  } = useContext(ClientContext)

  const tenant = params['tenant']

  const handleModalOpen = () => {
    setIsModalVisible(true)
  }

  const handleModalClose = () => {
    setIsModalVisible(false)
  }

  // If removing permissions, we want to remove it from both the permissions and addedPermissions array and add it to the removedPermissions array if it doesn't exist there
  const handleRemovedPermissions = (
    removedPermission: AuthAdminClientAllowedScope,
  ) => {
    const newPermissions = permissions.filter(
      (item) => item.name !== removedPermission.name,
    )
    const newAddedScopes = addedScopes.filter(
      (item) => item.name !== removedPermission.name,
    )
    setAddedScopes(newAddedScopes)
    setPermissions(newPermissions)

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

  const hasData = permissions.length > 0

  return (
    <ContentCard
      title={formatMessage(m.permissions)}
      description={formatMessage(m.permissionsDescription)}
      isDirty={addedScopes.length > 0 || removedScopes.length > 0}
      intent={ClientFormTypes.permissions}
      shouldSupportMultiEnvironment={false}
    >
      <Box marginBottom={5}>
        <Button onClick={handleModalOpen}>
          {formatMessage(m.permissionsAdd)}
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
              {[...permissions].map((item) => (
                <T.Row key={item.name}>
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
        value={addedScopes.map((scope) => scope.name).join(',')}
      />
      <input
        type="hidden"
        name="removedScopes"
        value={removedScopes.map((scope) => scope.name).join(',')}
      />
      <AddPermissions
        onAdd={(add) => setPermissions([...permissions, ...add])}
        onClose={handleModalClose}
        isVisible={isModalVisible}
      />
    </ContentCard>
  )
}

export default Permissions
