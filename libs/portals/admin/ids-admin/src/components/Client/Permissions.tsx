import ContentCard from '../../shared/components/ContentCard'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { Box, Button, Table as T, Text, Icon } from '@island.is/island-ui/core'
import React, { useContext, useState } from 'react'
import { ClientFormTypes } from '../forms/EditApplication/EditApplication.action'
import { ShadowBox } from '../ShadowBox/ShadowBox'
import { useNavigate, useParams } from 'react-router-dom'
import { replaceParams } from '@island.is/react-spa/shared'
import { IDSAdminPaths } from '../../lib/paths'
import { ClientContext } from '../../shared/context/ClientContext'
import { AuthAdminClientAllowedScope } from '@island.is/api/schema'

interface PermissionsProps {
  allowedScopes?: AuthAdminClientAllowedScope[] | null
}

function Permissions({ allowedScopes }: PermissionsProps) {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const params = useParams()
  const [permissions, setPermissions] = useState<AuthAdminClientAllowedScope[]>(
    allowedScopes as AuthAdminClientAllowedScope[],
  )
  const {
    addedScopes,
    removedScopes,
    setRemovedScopes,
    setAddedScopes,
  } = useContext(ClientContext)

  const tenant = params['tenant']

  const handleModalOpen = () => {
    navigate(
      replaceParams({
        href: IDSAdminPaths.IDSAdminClientScopes,
        params: { tenant: params['tenant'], client: params['client'] },
      }),
    )
  }

  // If removing permissions, we want to remove it from both the permissions and addedPermissions array and add it to the removedPermissions array if it doesn't exist there
  const handleRemovedPermissions = (
    removedPermission: AuthAdminClientAllowedScope,
  ) => {
    // Remove from both permissions and addedPermissions
    const newPermissions = permissions.filter(
      (permission) => permission.name !== removedPermission.name,
    )

    const newAddedSCopes = addedScopes.filter(
      (addedScope) => addedScope.name !== removedPermission.name,
    )
    setPermissions(newPermissions)
    setAddedScopes(newAddedSCopes)

    // Add to removedScopes if it doesn't exist there and is not in the newAddedScopes array (meaning it was added and then removed)
    if (
      !removedScopes.some(
        (removedScope) => removedScope.name === removedPermission.name,
      ) &&
      !newAddedSCopes.some(
        (addedScope) => addedScope.name === removedPermission.name,
      )
    ) {
      setRemovedScopes([...removedScopes, removedPermission])
    }
  }

  const hasData = Array.isArray(allowedScopes) && allowedScopes.length > 0

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
          <T.Table>
            <T.Head>
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
              {[...permissions, ...addedScopes].map((item) => (
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
                      <Text variant="eyebrow">{item.displayName}</Text>
                    </Box>
                    {item.name}
                  </T.Data>
                  <T.Data>{item.description}</T.Data>
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
    </ContentCard>
  )
}

export default Permissions
