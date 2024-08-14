import { FormSystemInput } from '@island.is/api/schema'
import { Checkbox as CheckboxField } from '@island.is/island-ui/core'

interface Props {
  item: FormSystemInput
}

export const Checkbox = ({ item }: Props) => {
  return (
    <CheckboxField
      name="checkbox"
      label={item?.name?.is ?? ''}
      checked={item?.inputSettings?.checked ?? false}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onChange={() => {}}
    />
  )
}
