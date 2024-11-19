import { useMemo, useState } from 'react'
import { ConfigType } from './types'

export const useSortableData = <T>(
  items: T[],
  config: ConfigType = { direction: 'ascending', key: '' },
) => {
  const [sortConfig, setSortConfig] = useState<ConfigType>(config)

  const sortedItems = useMemo(() => {
    const sortableItems = [...items]
    if (sortConfig.key !== '') {
      sortableItems.sort((a, b) => {
        const keyA = a[sortConfig.key as keyof T] as string
        const keyB = b[sortConfig.key as keyof T] as string
        return sortConfig.direction === 'ascending'
          ? keyA.localeCompare(keyB, undefined, { numeric: true })
          : keyA.localeCompare(keyB, undefined, { numeric: true }) * -1
      })
    }
    return sortableItems
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
