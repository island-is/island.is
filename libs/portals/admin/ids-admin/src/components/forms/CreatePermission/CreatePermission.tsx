import { Modal } from '../../Modal/Modal' // TODO: Change this to react-components when merged to main
import { replaceParams } from '@island.is/react-spa/shared'
import { IDSAdminPaths } from '../../../lib/paths'
import { Form, useNavigate, useRouteLoaderData } from 'react-router-dom'
import {
  tenantLoaderId,
  TenantLoaderResult,
} from '../../../screens/Tenant/Tenant.loader'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import {
  Box,
  Button,
  Checkbox,
  GridColumn,
  GridRow,
  Input,
  Text,
} from '@island.is/island-ui/core'
import { AuthAdminEnvironment } from '@island.is/api/schema'
import React, { ComponentPropsWithoutRef } from 'react'
import { parseID } from '../../../shared/utils/forms'

type InputOnChange = ComponentPropsWithoutRef<typeof Input>['onChange']

const environments = [
  AuthAdminEnvironment.Development,
  AuthAdminEnvironment.Staging,
  AuthAdminEnvironment.Production,
]

export default function CreatePermission() {
  const { formatMessage } = useLocale()

  const navigate = useNavigate()
  const tenant = useRouteLoaderData(tenantLoaderId) as TenantLoaderResult

  const handleClose = () => {
    navigate(
      replaceParams({
        href: IDSAdminPaths.IDSAdminPermissions,
        params: { tenant: tenant.id },
      }),
    )
  }

  const prefix = `prefix/`
  const [idState, setIdState] = React.useState({
    value: prefix,
    dirty: false,
  })

  const handleNameChange: InputOnChange = (ev) => {
    if (idState.dirty) {
      return
    }

    const { value } = ev.target

    setIdState((prevState) => ({
      ...prevState,
      value: parseID({ value, prefix }),
    }))
  }

  const handleIdChange: InputOnChange = (ev) => {
    const { value } = ev.target
    setIdState({
      value: parseID({ value, prefix }),
      dirty: true,
    })
  }

  return (
    <Modal
      label={formatMessage(m.createPermission)}
      title={formatMessage(m.createPermission)}
      id="creat-permission"
      isVisible
      onClose={handleClose}
    >
      <Box paddingTop={2}>
        <Form method="post">
          <GridRow rowGap={3}>
            <GridColumn span={['12/12', '6/12']}>
              <Input
                name="displayName"
                label={formatMessage(m.displayName)}
                size="sm"
                backgroundColor="blue"
                onChange={handleNameChange}
              />
              <Text variant="small" marginTop={1}>
                {formatMessage(m.permissionDisplayNameInfo)}
              </Text>
            </GridColumn>
            <GridColumn span={['12/12', '6/12']}>
              <Input
                name="permissionId"
                label={formatMessage(m.permissionId)}
                size="sm"
                backgroundColor="blue"
                value={idState.value}
                onChange={handleIdChange}
              />
            </GridColumn>
            <GridColumn span={['12/12']}>
              <Input
                name="description"
                label={formatMessage(m.permissionDescription)}
                size="sm"
                backgroundColor="blue"
              />
              <Text variant="small" marginTop={1}>
                {formatMessage(m.permissionDescriptionInfo)}
              </Text>
            </GridColumn>
            <GridColumn span="12/12">
              <Text variant="h4">{formatMessage(m.chooseEnvironment)}</Text>
            </GridColumn>
            {environments.map((env) => {
              const envName = tenant.availableEnvironments.find(
                (environment) => env === environment,
              )

              return (
                <GridColumn span={['12/12', '4/12']}>
                  <Checkbox
                    label={env}
                    name="environments"
                    id={`environments.${envName}`}
                    value={envName}
                    disabled={!tenant.availableEnvironments.includes(env)}
                    large
                    backgroundColor="blue"
                  />
                </GridColumn>
              )
            })}
          </GridRow>

          <Box display="flex" justifyContent="spaceBetween" marginTop={7}>
            <Button onClick={handleClose} variant="ghost" type="button">
              {formatMessage(m.cancel)}
            </Button>
            <Button type="submit">{formatMessage(m.create)}</Button>
          </Box>
        </Form>
      </Box>
    </Modal>
  )
}
