import { TableRepeaterItem } from '@island.is/application/types'
import { format as formatNationalId } from 'kennitala'
import { StaticText } from 'static-text'

export const checkForCustomMappedComponents = (
  items: Array<
    {
      id: string
    } & TableRepeaterItem
  >,
  tableRows: Array<string>,
  tableHeader: Array<StaticText | undefined>,
  values: any,
) => {
  items.forEach((item) => {
    if (item.component === 'nationalIdWithName') {
      handleNationalIdWithName(item, tableRows, tableHeader, values)
    }
  })
}

const handleNationalIdWithName = (
  item: {
    id: string
  } & TableRepeaterItem,
  tableRows: Array<string>,
  tableHeader: Array<StaticText | undefined>,
  values: any,
) => {
  // let table account for name that is being lookup up
  insert(tableRows, item.id, 'name')
  insert(tableHeader, item.label, 'Nafn')

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

const insert = (
  array: Array<any>,
  target: StaticText | undefined,
  valueToInsert: string,
) => {
  const index = array.indexOf(target)
  if (index !== -1) {
    array.splice(index + 1, 0, valueToInsert)
  }
}

const flattenObject = (value: any, id: string) => {
  const { [id]: nestedObject, ...rest } = value
  const newObj = { ...nestedObject, ...rest }

  newObj[id] = formatNationalId(newObj['nationalId'])
  id !== 'nationalId' && delete newObj['nationalId']

  return newObj
}
