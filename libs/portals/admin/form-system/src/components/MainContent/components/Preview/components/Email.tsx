import { useContext, useState } from 'react'
import { Input, Stack, Text } from '@island.is/island-ui/core'
import { ControlContext } from '../../../../../context/ControlContext'
import { FormSystemInput } from '@island.is/api/schema'
import { useIntl } from 'react-intl'
import { m } from '../../../../../lib/messages'

interface Props {
  currentItem: FormSystemInput
}

export const Email = ({ currentItem }: Props) => {
  const { control } = useContext(ControlContext)
  const { activeItem } = control
  const [email, setEmail] = useState('')
  const [hasError, setHasError] = useState(false)
  const isValidEmail = (): boolean => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const res = pattern.test(email)
    return !res
  }
  const { formatMessage } = useIntl()
  return (
    <Stack space={2}>
      <Text>{activeItem?.data?.name?.is}</Text>
      <Input
        type="email"
        name="email"
        label={formatMessage(m.email)}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setHasError(isValidEmail())}
        errorMessage={formatMessage(m.invalidEmail)}
        hasError={hasError}
        required={currentItem?.isRequired ?? false}
      />
    </Stack>
  )
}
