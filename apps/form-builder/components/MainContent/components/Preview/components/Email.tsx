import { useContext, useState } from 'react'
import { Input, Stack, Text } from '@island.is/island-ui/core'
import FormBuilderContext from '../../../../../context/FormBuilderContext'

export default function Email() {
  const { lists } = useContext(FormBuilderContext)
  const { activeItem } = lists
  const [email, setEmail] = useState('')
  const [hasError, setHasError] = useState(false)

  return (
    <Stack space={2}>
      <Text>{activeItem.data.name.is}</Text>
      <Input
        type="email"
        name="email"
        label="Netfang"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setHasError(isValidEmail())}
        errorMessage="Ekki gilt netfang"
        hasError={hasError}
      />
    </Stack>
  )

  function isValidEmail(): boolean {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const res = pattern.test(email)
    return !res
  }
}
