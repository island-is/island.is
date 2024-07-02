import { FormSystemInput } from '@island.is/api/schema'
import { Checkbox } from '@island.is/island-ui/core'

interface Props {
  currentItem: FormSystemInput
}

export const CheckboxPreview = ({ currentItem }: Props) => {
  return (
    <Checkbox
      name="checkbox"
      label={currentItem?.name?.is ?? ''}
      checked={currentItem?.inputSettings?.checked ?? false}
    />
  )
}
