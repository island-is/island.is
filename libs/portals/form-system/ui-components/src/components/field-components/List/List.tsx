import { FormSystemField } from '@island.is/api/schema'
import { Select } from '@island.is/island-ui/core'

interface Props {
  item: FormSystemField
}

type ListItem = {
  label: string
  value: string | number
}

const listTypePlaceholder = {
  lond: 'Veldu land',
  sveitarfelog: 'Veldu sveitarfélag',
  postnumer: 'Veldu póstnúmer',
  idngreinarMeistara: 'Veldu iðngrein',
}

export const List = ({ item }: Props) => {
  const listItems: ListItem[] = []

  return (
    <Select
      name="list"
      label={item.name?.is ?? ''}
      options={listItems}
      required={item.isRequired ?? false}
      placeholder={
        listTypePlaceholder[
          item.fieldSettings?.listType as keyof typeof listTypePlaceholder
        ] ?? 'Select an option'
      }
    />
  )
}
