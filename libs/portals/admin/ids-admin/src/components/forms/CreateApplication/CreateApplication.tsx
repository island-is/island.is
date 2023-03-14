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
  AuthAdminApplicationType,
  AuthAdminEnvironment,
} from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { CreateApplicationResult } from './CreateApplication.action'
import {
  tenantLoaderId,
  TenantLoaderResult,
} from '../../../screens/Tenant/Tenant.loader'
import { Modal } from '../../Modal/Modal'
import { IDSAdminPaths } from '../../../lib/paths'
import { replaceParams } from '@island.is/react-spa/shared'

const environments = [
  AuthAdminEnvironment.Development,
  AuthAdminEnvironment.Staging,
  AuthAdminEnvironment.Production,
]
const applicationTypes = [
  AuthAdminApplicationType.Web,
  AuthAdminApplicationType.Native,
  AuthAdminApplicationType.Machine,
]

/**
 * Formats the application id to be lowercase and replace spaces with dashes
 */
const formatApplicationId = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, '-')

/**
 * Parses the application id to be lowercase and replace spaces with dashes
 * Also makes sure that the prefix is always present and cannot be erased
 * @param prefix
 * @param value
 */
const parseApplicationId = ({
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
    return `${prefix}${formatApplicationId(value)}`
  }

  const prefixWithoutSlash = prefix.split('/')[0]

  if (value.startsWith(prefixWithoutSlash)) {
    value = value.replace(prefixWithoutSlash, '')
  }

  // If user tries to erase the prefix, we add it back
  return `${prefix}${formatApplicationId(value).split('/').pop()}`
}

type InputState = {
  value: string
  dirty: boolean
}

/**
 * Create application form within a modal
 */
export default function CreateApplication() {
  const navigate = useNavigate()
  const tenant = useRouteLoaderData(tenantLoaderId) as TenantLoaderResult
  const actionData = useActionData() as CreateApplicationResult
  const { formatMessage } = useLocale()
  const prefix = `${tenant.id}/`
  const initialApplicationIdState: InputState = {
    value: prefix,
    dirty: false,
  }

  const [
    applicationType,
    setApplicationState,
  ] = useState<AuthAdminApplicationType>(AuthAdminApplicationType.Web)
  const [applicationIdState, setApplicationIdState] = useState<InputState>(
    initialApplicationIdState,
  )

  const onNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (applicationIdState.dirty) return

    setApplicationIdState({
      ...applicationIdState,
      value: parseApplicationId({
        value: e.target.value,
        prefix,
      }),
    })
  }

  const onApplicationIdChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const val = e.target.value

    setApplicationIdState({
      value: parseApplicationId({
        value: val,
        prefix,
      }),
      dirty: true,
    })
  }

  const formatErrorMessage = (messageKey?: string) => {
    const message = m[messageKey as keyof typeof m]

    return message ? formatMessage(message) : undefined
  }

  const getRadioLabels = (applicationType: AuthAdminApplicationType) => {
    switch (applicationType) {
      case AuthAdminApplicationType.Web:
        return {
          label: formatMessage(m.webApplicationsTitle),
          subLabel: formatMessage(m.webApplicationsDescription),
        }
      case AuthAdminApplicationType.Native:
        return {
          label: formatMessage(m.nativeApplicationsTitle),
          subLabel: formatMessage(m.nativeApplicationsDescription),
        }
      case AuthAdminApplicationType.Machine:
        return {
          label: formatMessage(m.machineApplicationsTitle),
          subLabel: formatMessage(m.machineApplicationsDescription),
        }
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
      id="create-application"
      isVisible
      title={formatMessage(m.createApplication)}
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
              name="applicationId"
              label={formatMessage(m.applicationId)}
              size="sm"
              value={applicationIdState.value}
              onChange={onApplicationIdChange}
              errorMessage={formatErrorMessage(
                actionData?.errors?.applicationId,
              )}
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
            <Text variant="h4">{formatMessage(m.chooseApplicationType)}</Text>
            {applicationTypes.map((type) => (
              <Box width="full" key={type}>
                <RadioButton
                  {...getRadioLabels(type)}
                  backgroundColor="blue"
                  name="applicationType"
                  id={`applicationType.${type}`}
                  value={type}
                  onChange={(e) =>
                    setApplicationState(
                      e.target.value as AuthAdminApplicationType,
                    )
                  }
                  checked={applicationType === type}
                  large
                />
              </Box>
            ))}
          </Box>
          {actionData?.errors?.environments && (
            <InputError
              id="applicationType"
              errorMessage={formatErrorMessage(
                (actionData?.errors?.applicationType as unknown) as string,
              )}
            />
          )}
        </Box>
        <Box display="flex" justifyContent="spaceBetween" marginTop={7}>
          <Button onClick={onCancel} variant="ghost">
            {formatMessage(m.cancel)}
          </Button>
          <Button type="submit">{formatMessage(m.create)}</Button>
        </Box>
      </Form>
    </Modal>
  )
}
