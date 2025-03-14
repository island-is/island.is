import { useMemo, useState } from 'react'
import { ConfigType } from './types'

export const useSortableData = <T extends Record<string, unknown>>(
  items: T[],
  config: ConfigType = { direction: 'ascending', key: '' },
) => {
  const [sortConfig, setSortConfig] = useState<ConfigType>(config)

  const sortedItems = useMemo(() => {
    if (sortConfig.key === '') return items

    return [...items].sort((a, b) => {
      const keyA = a[sortConfig.key as keyof T]
      const keyB = b[sortConfig.key as keyof T]

      if (keyA === undefined || keyB === undefined) {
        return 0
      }

      const multiplier = sortConfig.direction === 'ascending' ? 1 : -1

      if (typeof keyA === 'string' && typeof keyB === 'string') {
        return (
          keyA.localeCompare(keyB, undefined, { numeric: true }) * multiplier
        )
      } else if (typeof keyA === 'number' && typeof keyB === 'number') {
        return (keyA - keyB) * multiplier
      } else if (keyA instanceof Date && keyB instanceof Date) {
        return (keyA.getTime() - keyB.getTime()) * multiplier
      } else {
        return 0
      }
    })
  }, [items, sortConfig])

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  return { items: sortedItems, requestSort, sortConfig }
}
