import { FormSystemField } from '@island.is/api/schema'
import { Checkbox as CheckboxField } from '@island.is/island-ui/core'

interface Props {
  item: FormSystemField
}

export const Checkbox = ({ item }: Props) => {
  return (
    <CheckboxField
      name="checkbox"
      label={item?.name?.is ?? ''}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onChange={() => {}}
    />
  )
}
