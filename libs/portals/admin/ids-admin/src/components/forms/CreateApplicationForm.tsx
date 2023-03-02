import React, { useRef } from 'react'
import { Box, Button, Input } from '@island.is/island-ui/core'
import { Form } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useState } from 'react'

const formatClientId = ({ prefix, name }: { prefix: string; name: string }) => {
  const formattedName = name.trim().toLowerCase().replace(/\s+/g, '-')

  if (formattedName.includes(prefix)) {
    return formattedName
  }

  return `${prefix}${formattedName}`
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
  const { formatMessage } = useLocale()
  const formRef = useRef<HTMLFormElement>(null)
  const CLIENT_ID_PREFIX = `${tenant}/`

  const initialClientIdState: InputState = {
    value: CLIENT_ID_PREFIX,
    dirty: false,
  }

  const initialDisplayNameState: InputState = {
    value: '',
    dirty: false,
  }

  const [clientIdState, setClientIdState] = useState<InputState>(
    initialClientIdState,
  )

  const [displayNameState, setDisplayNameState] = useState<InputState>(
    initialDisplayNameState,
  )

  const onNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const val = e.target.value

    setDisplayNameState({
      value: val,
      dirty: true,
    })

    if (clientIdState.dirty) return

    setClientIdState({
      ...clientIdState,
      value: formatClientId({
        prefix: CLIENT_ID_PREFIX,
        name: val,
      }),
    })
  }

  const onClientIdChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const val = e.target.value

    if (val.includes(CLIENT_ID_PREFIX)) {
      setClientIdState({
        value: formatClientId({
          prefix: CLIENT_ID_PREFIX,
          name: e.target.value,
        }),
        dirty: true,
      })
    }
  }

  const resetForm = () => {
    // Reset form fields that are not controlled by state
    formRef.current?.reset()
    // Reset state
    setClientIdState(initialClientIdState)
    setDisplayNameState(initialDisplayNameState)
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
            value={displayNameState.value}
            onChange={onNameChange}
          />
        </Box>
        <Box width="full">
          <Input
            type="text"
            name="clientId"
            label={formatMessage(m.clientId)}
            size="sm"
            value={clientIdState.value}
            onChange={onClientIdChange}
          />
        </Box>
      </Box>
      <Box display="flex" justifyContent="spaceBetween" marginTop={7}>
        <Button onClick={onCancelHandler} variant="ghost">
          {formatMessage(m.cancel)}
        </Button>
        <Button onClick={onCancel}>{formatMessage(m.create)}</Button>
      </Box>
    </Form>
  )
}
