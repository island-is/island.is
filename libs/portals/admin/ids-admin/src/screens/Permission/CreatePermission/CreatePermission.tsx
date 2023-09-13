import React, { ComponentPropsWithoutRef, useState } from 'react'
import {
  Form,
  useActionData,
  useNavigate,
  useRouteLoaderData,
} from 'react-router-dom'

import { Modal } from '@island.is/react/components'
import { replaceParams, useSubmitting } from '@island.is/react-spa/shared'
import { useLocale } from '@island.is/localization'
import {
  AlertMessage,
  Box,
  Button,
  Checkbox,
  GridColumn,
  GridRow,
  Input,
  InputError,
  Text,
} from '@island.is/island-ui/core'

import { IDSAdminPaths } from '../../../lib/paths'
import { tenantLoaderId, TenantLoaderResult } from '../../Tenant/Tenant.loader'
import { m } from '../../../lib/messages'
import { parseID } from '../../../utils/forms'
import { useErrorFormatMessage } from '../../../hooks/useFormatErrorMessage'
import { CreateScopeResult } from './CreatePermission.action'
import { authAdminEnvironments } from '../../../utils/environments'
import { useGetScopeAvailabilityLazyQuery } from './CreatePermission.generated'

type InputOnChange = ComponentPropsWithoutRef<typeof Input>['onChange']

export default function CreatePermission() {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { formatErrorMessage } = useErrorFormatMessage()
  const actionData = useActionData() as CreateScopeResult
  const tenant = useRouteLoaderData(tenantLoaderId) as TenantLoaderResult
  const { isLoading, isSubmitting } = useSubmitting()

  const [getScopeAvailabilityQuery, { data: scopeAvailabilityData }] =
    useGetScopeAvailabilityLazyQuery()
  const scopeIdAlreadyExists =
    (scopeAvailabilityData?.authAdminScope?.availableEnvironments?.length ??
      0) > 0
  const handleClose = () => {
    navigate(
      replaceParams({
        href: IDSAdminPaths.IDSAdminPermissions,
        params: { tenant: tenant.id },
      }),
    )
  }

  const prefix = `${tenant.id}/`
  const [idState, setIdState] = useState({
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

  const validateUniqueId = async () => {
    const scopeId = idState.value
    if (!scopeId) return

    await getScopeAvailabilityQuery({
      variables: {
        input: {
          scopeName: scopeId,
          tenantId: tenant.id,
        },
      },
    })
  }

  return (
    <Modal
      label={formatMessage(m.createPermission)}
      title={formatMessage(m.createPermission)}
      id="create-permission"
      isVisible
      onClose={handleClose}
      closeButtonLabel={formatMessage(m.closeModal)}
    >
      <Box paddingTop={2}>
        <Form method="post">
          <GridRow rowGap={3}>
            <GridColumn span={['12/12', '6/12']}>
              <input
                type="text"
                hidden
                name="tenantId"
                defaultValue={tenant.id}
              />
              <Input
                name="displayName"
                label={formatMessage(m.displayName)}
                size="sm"
                backgroundColor="blue"
                onChange={handleNameChange}
                onBlur={validateUniqueId}
                errorMessage={formatErrorMessage(
                  actionData?.errors?.displayName,
                )}
              />
              <Text variant="small" marginTop={1}>
                {formatMessage(m.permissionDisplayNameInfo)}
              </Text>
            </GridColumn>
            <GridColumn span={['12/12', '6/12']}>
              <Input
                name="name"
                label={formatMessage(m.permissionId)}
                size="sm"
                backgroundColor="blue"
                value={idState.value}
                onChange={handleIdChange}
                onBlur={validateUniqueId}
                errorMessage={
                  scopeIdAlreadyExists
                    ? formatMessage(m.permissionAlreadyExists)
                    : formatErrorMessage(actionData?.errors?.name)
                }
              />
            </GridColumn>
            <GridColumn span={['12/12']}>
              <Input
                name="description"
                label={formatMessage(m.permissionDescription)}
                size="sm"
                backgroundColor="blue"
                errorMessage={formatErrorMessage(
                  actionData?.errors?.description,
                )}
              />
              <Text variant="small" marginTop={1}>
                {formatMessage(m.permissionDescriptionInfo)}
              </Text>
            </GridColumn>
            <GridColumn span="12/12">
              <Text variant="h4">{formatMessage(m.chooseEnvironment)}</Text>
            </GridColumn>
            <GridColumn span="12/12">
              <GridRow rowGap={3}>
                {authAdminEnvironments.map((env) => {
                  const envName = tenant.availableEnvironments.find(
                    (environment) => env === environment,
                  )

                  return (
                    <GridColumn span={['12/12', '4/12']} key={env}>
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
              {actionData?.errors?.environments && (
                <GridRow>
                  <GridColumn span="12/12">
                    <InputError
                      id="environments"
                      errorMessage={formatErrorMessage(
                        actionData?.errors?.environments as unknown as string,
                      )}
                    />
                  </GridColumn>
                </GridRow>
              )}
            </GridColumn>
            {actionData?.globalError && (
              <GridColumn span={['12/12']}>
                <AlertMessage
                  message={formatMessage(m.errorDefault)}
                  type="error"
                />
              </GridColumn>
            )}
          </GridRow>

          <Box display="flex" justifyContent="spaceBetween" marginTop={7}>
            <Button onClick={handleClose} variant="ghost" type="button">
              {formatMessage(m.cancel)}
            </Button>
            <Button
              disabled={scopeIdAlreadyExists || !scopeAvailabilityData}
              type="submit"
              loading={isLoading || isSubmitting}
            >
              {formatMessage(m.create)}
            </Button>
          </Box>
        </Form>
      </Box>
    </Modal>
  )
}
