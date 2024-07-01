import { TableRepeaterItem } from '@island.is/application/types'

type Item = {
  id: string
} & TableRepeaterItem

export type Value<T> = { [key: string]: T }

export const handleCustomMappedValues = <T>(
  tableItems: Array<Item>,
  values: Array<Value<T>>,
) => {
  let customValues: Array<Value<T>> = []
  tableItems.forEach((item) => {
    if (item.component === 'nationalIdWithName') {
      customValues = handleNationalIdWithNameItem(item, values)
    }
  })
  return customValues
}

export const handleNationalIdWithNameItem = <T>(
  item: Item,
  values: Array<Value<T>>,
) => {
  if (!values) {
    return []
  }

  const newValues = values.map((value) => {
    if (typeof value[item.id] === 'object' && value[item.id] !== null) {
      const { [item.id]: nestedObject, ...rest } = value
      return { ...nestedObject, ...rest }
    }
    return value
  })

  return newValues
}
