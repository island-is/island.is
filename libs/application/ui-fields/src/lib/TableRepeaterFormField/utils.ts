import { RepeaterItem, TableRepeaterColumn } from '@island.is/application/types'
import { getFieldType, TableRow } from '../RepeaterItem/fieldTypes'

type Item = RepeaterItem & { id: string }

export const toTableRows = (items: Array<Item>, rows?: Array<TableRow>) =>
  rows?.map((row) =>
    items.reduce(
      (acc, item) =>
        getFieldType(item.component).toTableRow?.(item, acc) ?? acc,
      row,
    ),
  )

export const buildDefaultColumns = (
  items: Array<Item>,
): TableRepeaterColumn[] =>
  items.flatMap((item) => {
    const header =
      (typeof item.label === 'function'
        ? item.label({ index: 0 })
        : item.label) ?? ''
    return (
      getFieldType(item.component).tableColumns?.(item, header) ?? [
        { header, value: item.id },
      ]
    )
  })

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
