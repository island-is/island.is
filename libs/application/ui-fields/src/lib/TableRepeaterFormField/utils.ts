import { TableRepeaterItem } from '@island.is/application/types'

type Item = {
  id: string
} & TableRepeaterItem

export type Value<T> = { [key: string]: T }

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
