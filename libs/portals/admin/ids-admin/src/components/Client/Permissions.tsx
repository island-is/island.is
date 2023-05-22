import React, { useEffect, useState } from 'react'
import { useActionData, useParams } from 'react-router-dom'

import { AuthAdminClientAllowedScope } from '@island.is/api/schema'
import { Box, Button, Icon, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getTranslatedValue } from '@island.is/portals/core'

import ContentCard from '../../shared/components/ContentCard/ContentCard'
import { m } from '../../lib/messages'
import AddPermissions from '../forms/AddPermissions/AddPermissions'
import {
  ClientFormTypes,
  EditApplicationResult,
  schema,
} from '../forms/EditApplication/EditApplication.action'
import { ShadowBox } from '../ShadowBox/ShadowBox'

interface PermissionsProps {
  allowedScopes?: AuthAdminClientAllowedScope[]
}

function Permissions({ allowedScopes }: PermissionsProps) {
  const { formatMessage, locale } = useLocale()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const params = useParams()
  const [permissions, setPermissions] = useState<AuthAdminClientAllowedScope[]>(
    allowedScopes ?? [],
  )
  const [addedScopes, setAddedScopes] = useState<AuthAdminClientAllowedScope[]>(
    [],
  )
  const [removedScopes, setRemovedScopes] = useState<
    AuthAdminClientAllowedScope[]
  >([])
  const actionData = useActionData() as EditApplicationResult<
    typeof schema[typeof ClientFormTypes.permissions]
  >

  useEffect(() => {
    if (
      actionData?.intent === ClientFormTypes.permissions &&
      actionData?.data
    ) {
      setAddedScopes([])
      setRemovedScopes([])
    }
  }, [actionData])

  const tenant = params['tenant']

  const handleModalOpen = () => {
    setIsModalVisible(true)
  }

  const handleModalClose = () => {
    setIsModalVisible(false)
  }

  // If removing permissions, we want to remove it from both the permissions and addedPermissions array and add it to the removedPermissions array if it doesn't exist there
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

  // Add the selected scopes to the addedScopes array for
  const handleAdd = (selected: AuthAdminClientAllowedScope[]) => {
    // Combine the previously added scopes and the newly selected scopes
    const newAddedScopes = [...addedScopes, ...selected.values()]

    // Remove the scopes that were added that were also in the removedScopes array
    setAddedScopes(
      newAddedScopes.filter(
        (item) => !removedScopes.some((rem) => rem.name === item.name),
      ),
    )
    // Remove the scopes that were added from the removedScopes array
    setRemovedScopes(
      removedScopes.filter(
        (item) => !newAddedScopes.find((added) => added.name === item.name),
      ),
    )

    setPermissions([...permissions, ...selected])
  }

  const hasData = permissions.length > 0

  return (
    <ContentCard
      title={formatMessage(m.permissions)}
      description={formatMessage(m.permissionsDescription, {
        br: <br />,
      })}
      isDirty={addedScopes.length > 0 || removedScopes.length > 0}
      intent={ClientFormTypes.permissions}
      shouldSupportMultiEnvironment={false}
    >
      <Box marginBottom={5}>
        <Button size="small" onClick={handleModalOpen}>
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
              {permissions.map((item) => (
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
      <AddPermissions
        onAdd={handleAdd}
        onClose={handleModalClose}
        isVisible={isModalVisible}
        addedScopes={addedScopes}
        removedScopes={removedScopes}
      />
    </ContentCard>
  )
}

export default Permissions
