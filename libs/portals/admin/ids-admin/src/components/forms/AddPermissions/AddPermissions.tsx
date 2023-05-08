import { Modal } from '../../Modal/Modal'
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
import { replaceParams } from '@island.is/react-spa/shared'
import { IDSAdminPaths } from '../../../lib/paths'
import { useLoaderData, useNavigate, useParams } from 'react-router-dom'
import { ClientContext } from '../../../shared/context/ClientContext'
import { AuthScopes } from './AddPermissions.loader'
import { AuthAdminClientAllowedScope } from '@island.is/api/schema'

function AddPermissions() {
  const params = useParams()
  const navigate = useNavigate()
  const { formatMessage } = useLocale()
  const [selected, setSelected] = React.useState<
    Map<string, AuthAdminClientAllowedScope>
  >(new Map())
  const data = useLoaderData() as AuthScopes
  const { selectedEnvironment, setAddedScopes, addedScopes } = useContext(
    ClientContext,
  )

  const permissions = data.find(
    (item) => item.environment === selectedEnvironment.environment,
  )

  const final = permissions?.scopes.filter((item) => {
    return (
      !selectedEnvironment.allowedScopes?.some((i) => i.name === item.name) &&
      !addedScopes.some((i) => i.name === item.name)
    )
  }) as AuthAdminClientAllowedScope[]

  const close = () => {
    navigate(
      replaceParams({
        href: IDSAdminPaths.IDSAdminClient,
        params: { tenant: params['tenant'], client: params['client'] },
      }),
    )
  }

  const handleAdd = () => {
    setAddedScopes([...selected.values()])
    // Close the modal
    close()
  }

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
      title={formatMessage(m.permissionsModalTitle)}
      id="add-permissions"
      isVisible
      onClose={close}
    >
      <Box marginTop={1} marginBottom={4}>
        <Text>{formatMessage(m.permissionsModalDescription)}</Text>
      </Box>
      <ShadowBox isDisabled={false} flexShrink={1} overflow="auto">
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
            {final?.map((item) => (
              <T.Row key={item.name}>
                <T.Data>
                  <Checkbox
                    onChange={() => {
                      onChange(item)
                    }}
                    value={item.name}
                  />
                </T.Data>
                <T.Data>
                  <Text variant="eyebrow">{item.displayName}</Text>
                  {item.name}
                </T.Data>
                <T.Data>{item.description}</T.Data>
              </T.Row>
            ))}
          </T.Body>
        </T.Table>
      </ShadowBox>
      <Box display="flex" justifyContent="spaceBetween" marginTop={2}>
        <Button onClick={close} variant="ghost">
          {formatMessage(m.cancel)}
        </Button>
        <Button onClick={handleAdd}>{formatMessage(m.add)}</Button>
      </Box>
    </Modal>
  )
}

export default AddPermissions
