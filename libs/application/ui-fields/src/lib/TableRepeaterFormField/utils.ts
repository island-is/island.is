import { format as formatNationalId } from 'kennitala'
import { StaticText } from 'static-text'

export const insert = (
  array: Array<any>,
  target: StaticText | undefined,
  valueToInsert: string,
) => {
  const index = array.indexOf(target)
  if (index !== -1) {
    array.splice(index + 1, 0, valueToInsert)
  }
}

export const flattenValueObject = (value: any, id: string) => {
  const { [id]: nestedObject, ...rest } = value
  const newObj = { ...nestedObject, ...rest }

  newObj[id] = formatNationalId(newObj['nationalId'])

  return newObj
}
