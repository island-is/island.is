import { FormSystemInput } from '@island.is/api/schema'
import { Input } from '@island.is/island-ui/core'

interface Props {
  item: FormSystemInput
}

export const TextInput = ({ item }: Props) => {
  const { inputSettings } = item

  return (
    <Input
      label={item?.name?.is ?? ''}
      name="text"
      textarea={inputSettings?.isLarge ?? false}
      required={item?.isRequired ?? false}
    />
  )
}
