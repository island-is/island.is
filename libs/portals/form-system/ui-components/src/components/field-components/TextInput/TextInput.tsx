import { FormSystemField } from '@island.is/api/schema'
import { Input } from '@island.is/island-ui/core'

interface Props {
  item: FormSystemField
}

export const TextInput = ({ item }: Props) => {
  const { fieldSettings } = item

  return (
    <Input
      label={item?.name?.is ?? ''}
      name="text"
      textarea={fieldSettings?.isLarge ?? false}
      required={item.isRequired ?? false}
    />
  )
}
