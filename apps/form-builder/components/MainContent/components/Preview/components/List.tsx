import { Select } from '@island.is/island-ui/core'
import { useEffect, useState } from 'react'
import { IInput } from '../../../../../types/interfaces'

interface Props {
  currentItem: IInput
}

type ListItem = {
  label: string
  value: string | number
}

export default function List({ currentItem }: Props) {
  const [listItems, setListItems] = useState<ListItem[]>([])
  useEffect(() => {
    setListItems(
      currentItem.inputSettings.listi.map((l) => ({
        label: l.label.is,
        value: l.label.is,
      })),
    )
  }, [currentItem.inputSettings.listi])
  return (
    <>
      <Select name="list" label={currentItem.name.is} options={listItems} />
    </>
  )
}
