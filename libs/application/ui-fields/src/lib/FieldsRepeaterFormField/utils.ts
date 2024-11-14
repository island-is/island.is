import { RepeaterItem } from '@island.is/application/types'

type Item = {
  id: string
} & RepeaterItem

export type Value<T> = { [key: string]: T }

export const handleCustomMappedValues = <T>(
  tableItems: Array<Item>,
  values: Array<Value<T>>,
) => {
  // Iterate over tableItems and handle items with nationalIdWithName component
  return tableItems.reduce((acc, item) => {
    if (item.component === 'nationalIdWithName') {
      return handleNationalIdWithNameItem(item, values)
    }
    return acc
  }, [] as Array<Value<T>>)
}

const handleNationalIdWithNameItem = <T>(
  item: Item,
  values: Array<Value<T>>,
) => {
  if (!values?.length) {
    return []
  }

  // nationalIdWithName is a special case where the value is an object
  // with a nested object inside it. This function will extract the nested
  // object and merge it with the rest of the values.
  const newValues = values.map((value) => {
    if (typeof value[item.id] === 'object' && value[item.id] !== null) {
      const { [item.id]: nestedObject, ...rest } = value
      return { ...nestedObject, ...rest }
    }
    return value
  })

  return newValues
}
