import { TableRepeaterItem } from '@island.is/application/types'

type Item = {
  id: string
} & TableRepeaterItem

export const checkForCustomMappedComponents = (
  items: Array<Item>,
  values: any,
) => {
  items.some((item) => {
    if (item.component === 'nationalIdWithName') {
      handleNationalIdWithName(item, values)
    }
  })
}

const handleNationalIdWithName = (item: Item, values: any) => {
  // nationalIdWithName returns an object that we
  // need to extract entries from and add to values
  if (values) {
    values.forEach((value: any, index: string) => {
      if (typeof value[item.id] === 'object') {
        values[index] = flattenObject(value, item.id)
      }
    })
  }
}

const flattenObject = (value: any, id: string) => {
  const { [id]: nestedObject, ...rest } = value
  return { ...nestedObject, ...rest }
}
