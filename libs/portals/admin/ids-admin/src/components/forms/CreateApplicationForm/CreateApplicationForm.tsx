import React, { useRef } from 'react'
import { Box, Button, Input } from '@island.is/island-ui/core'
import { Form, useActionData } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { useState } from 'react'

const formatClientId = (name: string) => {
  return name.trim().toLowerCase().replace(/\s+/g, '-')
}

type InputState = {
  value: string
  dirty: boolean
}

type CreateApplicationFormProps = {
  onCancel(): void
  tenant: string
}

export const CreateApplicationForm = ({
  onCancel,
  tenant,
}: CreateApplicationFormProps) => {
  const actionData = useActionData()
  const { formatMessage } = useLocale()
  const formRef = useRef<HTMLFormElement>(null)
  const CLIENT_ID_PREFIX = `${tenant}/`

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
          />
        </Box>
        <Box width="full">
          <input type="text" hidden name="tenant" value={tenant} />
          <Input
            type="text"
            name="clientId"
            label={formatMessage(m.clientId)}
            size="sm"
            prefix={CLIENT_ID_PREFIX}
            value={clientIdState.value}
            onChange={onClientIdChange}
          />
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
