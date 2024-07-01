import { TableRepeaterItem } from '@island.is/application/types'

type Item = {
  id: string
} & TableRepeaterItem

interface Value<T> {
  [key: string]: T
}

export const checkForCustomMappedComponents = (
  items: Array<Item>,
  values: Array<Value<object>>,
) => {
  items.some((item) => {
    if (item.component === 'nationalIdWithName') {
      handleNationalIdWithNameItem(item, values)
    }
  })
}

const handleNationalIdWithNameItem = (item: Item, values: Array<Value<object>>) => {
  if (!values) {
    return
  }

  // nationalIdWithName returns an object that we
  // need to extract entries from and add to values
  values.forEach((value: Value<object>, index: number) => {
    if (typeof value[item.id] === 'object' && value[item.id] !== null) {
      const { [item.id]: nestedObject, ...rest } = value
      values[index] = { ...nestedObject, ...rest }
    }
  })
}
