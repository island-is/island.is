import React, { useRef } from 'react'
import { Box, Button, Checkbox, Input, Text } from '@island.is/island-ui/core'
import { Form, useActionData, useRouteLoaderData } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { useState } from 'react'
import { CreateApplicationResult } from './CreateApplication.action'
import {
  tenantLoaderId,
  TenantLoaderResult,
} from '../../../screens/Tenant/Tenant.loader'
import { AuthAdminEnvironment } from '@island.is/api/schema'

const environments = Object.values(AuthAdminEnvironment)

const formatClientId = (name: string) => {
  return name.trim().toLowerCase().replace(/\s+/g, '-')
}

type InputState = {
  value: string
  dirty: boolean
}

type CreateApplicationFormProps = {
  onCancel(): void
}

export const CreateApplication = ({ onCancel }: CreateApplicationFormProps) => {
  const tenant = useRouteLoaderData(tenantLoaderId) as TenantLoaderResult
  const actionData = useActionData() as CreateApplicationResult
  const { formatMessage } = useLocale()
  const formRef = useRef<HTMLFormElement>(null)
  const CLIENT_ID_PREFIX = `${tenant.id}/`

  const initialClientIdState: InputState = {
    value: '',
    dirty: false,
  }

  const [clientIdState, setClientIdState] = useState<InputState>(
    initialClientIdState,
  )

  const onNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (clientIdState.dirty) return

    setClientIdState({
      ...clientIdState,
      value: formatClientId(e.target.value),
    })
  }

  const onClientIdChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const val = e.target.value

    setClientIdState({
      value: formatClientId(val),
      dirty: true,
    })
  }

  const resetForm = () => {
    // Reset form fields that are not controlled by state
    formRef.current?.reset()
    // Reset state
    setClientIdState(initialClientIdState)
  }

  const onCancelHandler = () => {
    resetForm()
    onCancel()
  }

  return (
    <Form method="post" ref={formRef}>
      <Box display="flex" columnGap={3} marginTop={4}>
        <Box width="full">
          <Input
            type="text"
            name="displayName"
            label={formatMessage(m.displayName)}
            size="sm"
            onChange={onNameChange}
            errorMessage={actionData?.errors?.displayName}
          />
        </Box>
        <Box width="full">
          <input type="text" hidden name="tenant" defaultValue={tenant.id} />
          <Input
            type="text"
            name="clientId"
            label={formatMessage(m.clientId)}
            size="sm"
            prefix={CLIENT_ID_PREFIX}
            value={clientIdState.value}
            onChange={onClientIdChange}
            errorMessage={actionData?.errors?.clientId}
          />
        </Box>
      </Box>
      <Box marginTop={3}>
        <Text variant="h4">{formatMessage(m.chooseEnvironment)}</Text>
        <Box display="flex" columnGap={3}>
          {environments.map((env) => {
            const envName = tenant.availableEnvironments.find(
              (environment) => env === environment,
            )
            return (
              <Box width="full">
                <Checkbox
                  key={env}
                  label={env}
                  name={envName}
                  id={envName}
                  value="true"
                  disabled={!tenant.availableEnvironments.includes(env)}
                  large
                />
              </Box>
            )
          })}
        </Box>
      </Box>
      <Box display="flex" justifyContent="spaceBetween" marginTop={7}>
        <Button onClick={onCancelHandler} variant="ghost">
          {formatMessage(m.cancel)}
        </Button>
        <Button type="submit">{formatMessage(m.create)}</Button>
      </Box>
    </Form>
  )
}
