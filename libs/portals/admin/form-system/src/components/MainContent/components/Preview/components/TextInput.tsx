import { FormSystemInput } from '@island.is/api/schema'
import { Input } from '@island.is/island-ui/core'

interface Props {
  data: FormSystemInput
}

export const TextInput = ({ data }: Props) => {
  const { inputSettings } = data

  return (
    <Input
      label={data?.name?.is ?? ''}
      name="text"
      textarea={inputSettings?.isLarge ?? false}
    />
  )
}
