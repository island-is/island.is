import { FormSystemInput, FormSystemListItem } from '@island.is/api/schema'
import { useEffect, useState } from 'react'
import { Select } from '@island.is/island-ui/core'

interface Props {
  currentItem: FormSystemInput
}

type ListItem = {
  label: string
  value: string | number
}

export const List = ({ currentItem }: Props) => {
  const [listItems, setListItems] = useState<ListItem[]>([])
  useEffect(() => {
    const currentList = currentItem.inputSettings?.list ?? []
    setListItems(
      currentList.map((l: FormSystemListItem) => ({
        label: l?.label?.is ?? '',
        value: l?.label?.is ?? '',
      })),
    )
  }, [currentItem.inputSettings?.list])

  return (
    <>
      <Select
        name="list"
        label={currentItem?.name?.is ?? ''}
        options={listItems}
        required={currentItem?.isRequired ?? false}
      />
    </>
  )
}
