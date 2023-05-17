import { Modal } from '@island.is/react/components'
import {
  Box,
  Button,
  Checkbox,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { m } from '../../../lib/messages'
import { useLocale } from '@island.is/localization'
import React, { useContext } from 'react'
import { ShadowBox } from '../../ShadowBox/ShadowBox'
import { ClientContext } from '../../../shared/context/ClientContext'
import { AuthAdminClientAllowedScope } from '@island.is/api/schema'
import { getTranslatedValue } from '@island.is/portals/core'
import { useGetAvailableScopesQuery } from './AvailableScopes.generated'
import { useParams } from 'react-router-dom'

interface AddPermissionsProps {
  isVisible: boolean
  onClose: () => void
  onAdd: (permissions: AuthAdminClientAllowedScope[]) => void
}

function AddPermissions({ isVisible, onClose, onAdd }: AddPermissionsProps) {
  const { formatMessage, locale } = useLocale()
  const [selected, setSelected] = React.useState<
    Map<string, AuthAdminClientAllowedScope>
  >(new Map())
  const params = useParams()
  const [availableScopes, setAvailableScopes] = React.useState<
    AuthAdminClientAllowedScope[]
  >([])

  const {
    selectedEnvironment,
    setAddedScopes,
    addedScopes,
    removedScopes,
    setRemovedScopes,
  } = useContext(ClientContext)

  const { loading } = useGetAvailableScopesQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: {
        tenantId: params['tenant'] ?? '',
      },
    },
    onCompleted: (data) => {
      const scopes = data.authAdminScopes?.data
        .map((item) => {
          return (
            item.environments.find(
              (scope) => scope.environment === selectedEnvironment.environment,
            ) ?? null
          )
        })
        .filter((item) => item !== null)

      setAvailableScopes(scopes as AuthAdminClientAllowedScope[])
    },
  })
  // Get the available scopes for the selected environment including the scopes that have already been deleted
  const available = availableScopes
    ?.filter((item) => {
      return ![
        ...addedScopes,
        ...(selectedEnvironment?.allowedScopes ?? []),
      ].find((added) => added.name === item.name)
    })
    .concat(removedScopes)

  // Add the selected scopes to the addedScopes array for
  const handleAdd = () => {
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
