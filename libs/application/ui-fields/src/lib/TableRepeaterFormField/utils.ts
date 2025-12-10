import { RepeaterItem } from '@island.is/application/types'
import { coreMessages } from '@island.is/application/core'
import * as kennitala from 'kennitala'

type Item = {
  id: string
} & RepeaterItem

export type Value<T> = { [key: string]: T }

export const handleCustomMappedValues = <T>(
  tableItems: Array<Item>,
  values: Array<Value<T>>,
) => {
  return tableItems.reduce((acc, item) => {
    if (item.component === 'nationalIdWithName') {
      return handleNationalIdWithNameItem(item, acc.length ? acc : values)
    }

    if (item.component === 'vehiclePermnoWithInfo') {
      return handleVehiclePermnoWithInfoItem(item, acc.length ? acc : values)
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
    if (!!value[item.id] && typeof value[item.id] === 'object') {
      const { [item.id]: nestedObject, ...rest } = value
      const formattedNationalId = kennitala.format(
        (nestedObject as { nationalId: string })?.nationalId,
      )
      return {
        ...nestedObject,
        nationalId: formattedNationalId as T,
        ...rest,
      }
    }
    return value
  })

  return newValues
}

const handleVehiclePermnoWithInfoItem = <T>(
  item: Item,
  values: Array<Value<T>>,
) => {
  if (!values?.length) {
    return []
  }

  return values.map((value) => {
    const nested = value[item.id]
    if (!!nested && typeof nested === 'object') {
      const { [item.id]: _, ...rest } = value
      const flat: Record<string, T> = {}

      Object.keys(nested as Record<string, unknown>).forEach((key) => {
        flat[`${item.id}.${key}`] = (nested as Record<string, T>)[key]
      })

      return {
        ...rest,
        ...flat,
      }
    }

    return value
  })
}

export const buildDefaultTableHeader = (items: Array<RepeaterItem>) =>
  items
    .map((item, index) =>
      // nationalIdWithName is a special case where the value is an object of name and nationalId
      item.component === 'nationalIdWithName'
        ? [coreMessages.name, coreMessages.nationalId]
        : typeof item.label === 'function'
        ? item.label(index)
        : item.label,
    )
    .flat(2)

export const buildDefaultTableRows = (
  items: Array<RepeaterItem & { id: string }>,
) =>
  items
    .map((item) => {
      // nationalIdWithName is a special case where the value is an object of name and nationalId
      if (item.component === 'nationalIdWithName') {
        return ['name', 'nationalId']
      } else if (item.component === 'vehiclePermnoWithInfo') {
        return `${item.id}.permno`
      } else {
        return item.id
      }
    })
    .flat(2)

export const setObjectWithNestedKey = <T extends Record<string, unknown>>(
  obj: T,
  nestedKey: string,
  value: unknown,
): void => {
  const keys = nestedKey.split('.')
  let current: Record<string, unknown> = obj

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (
      !(key in current) ||
      typeof current[key] !== 'object' ||
      current[key] === null
    ) {
      current[key] = {}
    }
    current = current[key] as Record<string, unknown>
  }

  current[keys[keys.length - 1]] = value
}
