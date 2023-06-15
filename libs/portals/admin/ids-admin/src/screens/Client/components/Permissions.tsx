import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { AuthAdminClientAllowedScope } from '@island.is/api/schema'
import { Box, Button, Icon, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getTranslatedValue } from '@island.is/portals/core'

import { m } from '../../../lib/messages'
import { ClientFormTypes } from '../EditClient.schema'
import { ShadowBox } from '../../../components/ShadowBox/ShadowBox'
import { AddPermissions } from './AddPermissions/AddPermissions'
import { useEnvironmentState } from '../../../hooks/useEnvironmentState'
import { useClient } from '../ClientContext'
import { FormCard } from '../../../components/FormCard/FormCard'

interface PermissionsProps {
  allowedScopes?: AuthAdminClientAllowedScope[]
}

function Permissions({ allowedScopes }: PermissionsProps) {
  const { formatMessage, locale } = useLocale()
  const { tenant } = useParams()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [permissions, setPermissions] = useEnvironmentState<
    AuthAdminClientAllowedScope[]
  >(allowedScopes ?? [])
  const [addedScopes, setAddedScopes] = useState<AuthAdminClientAllowedScope[]>(
    [],
  )
  const [removedScopes, setRemovedScopes] = useState<
    AuthAdminClientAllowedScope[]
  >([])
  const { actionData } = useClient()

  useEffect(() => {
    if (
      actionData?.intent === ClientFormTypes.permissions &&
      actionData?.data
    ) {
      setAddedScopes([])
      setRemovedScopes([])
    }
  }, [actionData])

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

  const hasData =
    permissions.length > 0 || addedScopes.length > 0 || removedScopes.length > 0

  const customValidation = useCallback(
    () => addedScopes.length > 0 || removedScopes.length > 0,
    [addedScopes, removedScopes],
  )

  return (
    <FormCard
      title={formatMessage(m.permissions)}
      description={formatMessage(m.permissionsDescription, {
        br: <br />,
      })}
      customValidation={customValidation}
      intent={hasData ? ClientFormTypes.permissions : undefined}
      shouldSupportMultiEnvironment={false}
      headerMarginBottom={3}
    >
      <Box
        marginBottom={hasData ? 5 : 0}
        display="flex"
        justifyContent="flexEnd"
      >
        <Button
          size="small"
          onClick={handleModalOpen}
          dataTestId="add-permissions-button"
        >
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
      <AddPermissions
        onAdd={handleAdd}
        onClose={handleModalClose}
        isVisible={isModalVisible}
        addedScopes={addedScopes}
        removedScopes={removedScopes}
      />
    </FormCard>
  )
}

export default Permissions
