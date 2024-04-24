import { useContext, useState } from 'react'
import { Input, Stack, Text } from '@island.is/island-ui/core'
import ControlContext from '../../../../../context/ControlContext'
import { FormSystemInput } from '@island.is/api/schema'

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
  return (
    <Stack space={2}>
      <Text>{activeItem?.data?.name?.is}</Text>
      <Input
        type="email"
        name="email"
        label="Netfang"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setHasError(isValidEmail())}
        errorMessage="Ekki gilt netfang"
        hasError={hasError}
        required={currentItem?.isRequired ?? false}
      />
    </Stack>
  )
}

export default Email
