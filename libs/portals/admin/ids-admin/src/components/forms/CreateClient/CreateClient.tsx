import React, { useState } from 'react'
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
import {
  Form,
  useActionData,
  useNavigate,
  useRouteLoaderData,
} from 'react-router-dom'
import {
  AuthAdminClientType,
  AuthAdminEnvironment,
} from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { CreateClientResult } from './CreateClient.action'
import {
  tenantLoaderId,
  TenantLoaderResult,
} from '../../../screens/Tenant/Tenant.loader'
import { Modal } from '../../Modal/Modal'
import { IDSAdminPaths } from '../../../lib/paths'
import { replaceParams, useSubmitting } from '@island.is/react-spa/shared'
import { useErrorFormatMessage } from '../../../shared/hooks/useFormatErrorMessage'

const environments = [
  AuthAdminEnvironment.Development,
  AuthAdminEnvironment.Staging,
  AuthAdminEnvironment.Production,
]
const clientTypes = [
  AuthAdminClientType.web,
  AuthAdminClientType.native,
  AuthAdminClientType.machine,
]

const isToEnChar = {
  ð: 'd',
  þ: 'th',
  æ: 'ae',
  ö: 'o',
  á: 'a',
  é: 'e',
  í: 'i',
  ó: 'o',
  ú: 'u',
  ý: 'y',
  Ð: 'd',
  Þ: 'th',
  Æ: 'ae',
  Ö: 'o',
  Á: 'a',
  É: 'e',
  Í: 'i',
  Ó: 'o',
  Ú: 'u',
  Ý: 'y',
}

/**
 * Formats the client id to be lowercase and replace spaces with dashes
 */
const formatClientId = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, '-')

/**
 * Parses the client id to be lowercase and replace spaces with dashes
 * Also makes sure that the prefix is always present and cannot be erased
 * @param prefix
 * @param value
 */
const parseClientId = ({
  prefix,
  value,
}: {
  prefix: string
  value: string
}) => {
  // If user tries to erase the prefix, we add it back
  if (prefix.startsWith(value) && value.length < prefix.length) {
    return prefix
  }

  if (value.includes(prefix)) {
    value = value.replace(prefix, '')
    return `${prefix}${formatClientId(value)}`
  }

  const prefixWithoutSlash = prefix.split('/')[0]

  if (value.startsWith(prefixWithoutSlash)) {
    value = value.replace(prefixWithoutSlash, '')
  }

  value = value.replace(/[ðþæöáéíóúýÐÞÆÖÁÉÍÓÚÝ]/g, (m) => {
    return isToEnChar[m as keyof typeof isToEnChar]
  })

  // If user tries to erase the prefix, we add it back
  return `${prefix}${formatClientId(value).split('/').pop()}`
}

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
  const [clientIdState, setClientIdState] = useState<InputState>(
    initialClientIdState,
  )

  const onNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (clientIdState.dirty) return

    setClientIdState({
      ...clientIdState,
      value: parseClientId({
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
      value: parseClientId({
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
        href: IDSAdminPaths.IDSAdminTenants,
        params: { tenant: tenant.id },
      }),
    )
  }

  return (
    <Modal
      id="create-client"
      isVisible
      title={formatMessage(m.createClient)}
      onClose={onCancel}
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
              value={clientIdState.value}
              onChange={onClientIdChange}
              errorMessage={formatErrorMessage(actionData?.errors?.clientId)}
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
            {environments.map((env) => {
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
                (actionData?.errors?.environments as unknown) as string,
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
                (actionData?.errors?.clientType as unknown) as string,
              )}
            />
          )}
        </Box>
        <Box display="flex" justifyContent="spaceBetween" marginTop={7}>
          <Button onClick={onCancel} variant="ghost">
            {formatMessage(m.cancel)}
          </Button>
          <Button type="submit" loading={isLoading || isSubmitting}>
            {formatMessage(m.create)}
          </Button>
        </Box>
      </Form>
    </Modal>
  )
}
