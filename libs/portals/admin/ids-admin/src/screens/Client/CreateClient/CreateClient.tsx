import React, { useState } from 'react'
import {
  Form,
  useActionData,
  useNavigate,
  useRouteLoaderData,
} from 'react-router-dom'

import {
  AlertMessage,
  Box,
  Button,
  Checkbox,
  Input,
  InputError,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import { AuthAdminClientType } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { Modal } from '@island.is/react/components'
import { replaceParams, useSubmitting } from '@island.is/react-spa/shared'
import { isDefined } from '@island.is/shared/utils'

import { m } from '../../../lib/messages'
import { CreateClientResult } from './CreateClient.action'
import { tenantLoaderId, TenantLoaderResult } from '../../Tenant/Tenant.loader'
import { IDSAdminPaths } from '../../../lib/paths'
import { useErrorFormatMessage } from '../../../hooks/useFormatErrorMessage'
import { parseID } from '../../../utils/forms'
import { authAdminEnvironments } from '../../../utils/environments'
import { useGetClientAvailabilityLazyQuery } from './CreateClient.generated'

const clientTypes = [
  AuthAdminClientType.web,
  AuthAdminClientType.native,
  AuthAdminClientType.machine,
]

type InputState = {
  value: string
  dirty: boolean
}

/**
 * Create client form within a modal
 */
export default function CreateClient() {
  const navigate = useNavigate()
  const { isLoading, isSubmitting } = useSubmitting()
  const tenant = useRouteLoaderData(tenantLoaderId) as TenantLoaderResult
  const actionData = useActionData() as CreateClientResult
  const { formatMessage } = useLocale()
  const { formatErrorMessage } = useErrorFormatMessage()
  const prefix = `${tenant.id}/`
  const initialClientIdState: InputState = {
    value: prefix,
    dirty: false,
  }

  const [clientType, setClientState] = useState<AuthAdminClientType>(
    AuthAdminClientType.web,
  )
  const [clientIdState, setClientIdState] =
    useState<InputState>(initialClientIdState)

  const [getClientAvailabilityQuery, { data: availabilityData }] =
    useGetClientAvailabilityLazyQuery()
  const clientIdAlreadyExists = isDefined(availabilityData?.authAdminClient)

  const validateUniqueClientId = async () => {
    const clientId = clientIdState.value
    if (!clientIdState.value) return

    await getClientAvailabilityQuery({
      variables: {
        input: {
          clientId,
          tenantId: tenant.id,
          includeArchived: true,
        },
      },
    })
  }

  const onNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (clientIdState.dirty) return

    setClientIdState({
      ...clientIdState,
      value: parseID({
        value: e.target.value,
        prefix,
      }),
    })
  }

  const onClientIdChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const val = e.target.value

    setClientIdState({
      value: parseID({
        value: val,
        prefix,
      }),
      dirty: true,
    })
  }

  const getRadioLabels = (clientType: AuthAdminClientType) => {
    switch (clientType) {
      case AuthAdminClientType.web:
        return {
          label: formatMessage(m.webClientsTitle),
          subLabel: formatMessage(m.webClientsDescription),
        }
      case AuthAdminClientType.native:
        return {
          label: formatMessage(m.nativeClientsTitle),
          subLabel: formatMessage(m.nativeClientsDescription),
        }
      case AuthAdminClientType.machine:
        return {
          label: formatMessage(m.machineClientsTitle),
          subLabel: formatMessage(m.machineClientsDescription),
        }
      default:
        return null
    }
  }

  const onCancel = () => {
    navigate(
      replaceParams({
        href: IDSAdminPaths.IDSAdminClients,
        params: { tenant: tenant.id },
      }),
    )
  }

  return (
    <Modal
      id="create-client"
      isVisible
      label={formatMessage(m.createClient)}
      title={formatMessage(m.createClient)}
      onClose={onCancel}
      closeButtonLabel={formatMessage(m.closeModal)}
    >
      {actionData?.globalError && (
        <Box marginTop={3}>
          <AlertMessage message={formatMessage(m.errorDefault)} type="error" />
        </Box>
      )}
      <Form method="post">
        <Box
          display="flex"
          flexDirection={['column', 'row']}
          columnGap={3}
          rowGap={2}
          marginTop={4}
        >
          <Box width="full">
            <Input
              type="text"
              name="displayName"
              label={formatMessage(m.displayName)}
              size="sm"
              onChange={onNameChange}
              onBlur={validateUniqueClientId}
              errorMessage={formatErrorMessage(actionData?.errors?.displayName)}
            />
          </Box>
          <Box width="full">
            <input type="text" hidden name="tenant" defaultValue={tenant.id} />

            <Input
              type="text"
              name="clientId"
              label={formatMessage(m.clientId)}
              size="sm"
              hasError={clientIdAlreadyExists}
              value={clientIdState.value}
              onChange={onClientIdChange}
              onBlur={validateUniqueClientId}
              errorMessage={
                clientIdAlreadyExists
                  ? formatMessage(m.clientIdAlreadyExists)
                  : formatErrorMessage(actionData?.errors?.clientId)
              }
            />
          </Box>
        </Box>
        <Box marginTop={3}>
          <Text variant="h4">{formatMessage(m.chooseEnvironment)}</Text>
          <Box
            display="flex"
            flexDirection={['column', 'row']}
            columnGap={3}
            rowGap={2}
            marginTop={2}
          >
            {authAdminEnvironments.map((env) => {
              const envName = tenant.availableEnvironments.find(
                (environment) => env === environment,
              )

              return (
                <Box width="full" key={env}>
                  <Checkbox
                    label={env}
                    name="environments"
                    id={`environments.${envName}`}
                    value={envName}
                    disabled={!tenant.availableEnvironments.includes(env)}
                    large
                  />
                </Box>
              )
            })}
          </Box>
          {actionData?.errors?.environments && (
            <InputError
              id="environments"
              errorMessage={formatErrorMessage(
                actionData?.errors?.environments as unknown as string,
              )}
            />
          )}
        </Box>
        <Box marginTop={4}>
          <Box display="flex" flexDirection="column" rowGap={2}>
            <Text variant="h4">{formatMessage(m.chooseClientType)}</Text>
            {clientTypes.map((type) => (
              <Box width="full" key={type}>
                <RadioButton
                  {...getRadioLabels(type)}
                  backgroundColor="blue"
                  name="clientType"
                  id={`clientType.${type}`}
                  value={type}
                  onChange={(e) =>
                    setClientState(e.target.value as AuthAdminClientType)
                  }
                  checked={clientType === type}
                  large
                />
              </Box>
            ))}
          </Box>
          {actionData?.errors?.environments && (
            <InputError
              id="applicationType"
              errorMessage={formatErrorMessage(
                actionData?.errors?.clientType as unknown as string,
              )}
            />
          )}
        </Box>
        <Box display="flex" justifyContent="spaceBetween" marginTop={7}>
          <Button onClick={onCancel} variant="ghost">
            {formatMessage(m.cancel)}
          </Button>
          <Button
            disabled={clientIdAlreadyExists || availabilityData === undefined}
            type="submit"
            loading={isLoading || isSubmitting}
          >
            {formatMessage(m.create)}
          </Button>
        </Box>
      </Form>
    </Modal>
  )
}
