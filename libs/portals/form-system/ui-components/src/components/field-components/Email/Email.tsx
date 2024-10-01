import { useState } from 'react'
import { Input, Stack, Text } from '@island.is/island-ui/core'
import { FormSystemField } from '@island.is/api/schema'
import { useIntl } from 'react-intl'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
}

export const Email = ({ item }: Props) => {
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
      <Text>{item?.name?.is}</Text>
      <Input
        type="email"
        name="email"
        label={formatMessage(m.email)}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setHasError(isValidEmail())}
        errorMessage={formatMessage(m.invalidEmail)}
        hasError={hasError}
        required={item?.isRequired ?? false}
      />
    </Stack>
  )
}
