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

      if (!(typeof keyA === 'string') || !(typeof keyB === 'string')) {
        return 0
      }

      const multiplier = sortConfig.direction === 'ascending' ? 1 : -1
      return keyA.localeCompare(keyB, undefined, { numeric: true }) * multiplier
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
