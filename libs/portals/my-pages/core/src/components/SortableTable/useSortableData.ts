import { useMemo, useState } from 'react'
import { ConfigType } from './types'

// Check if the date string is of the format dd.mm.yyyy
// and return an object with day, month, and year
const decunstructDateString = (dateString: string) => {
  const pattern = /^(\d{2})\.(\d{2})\.(\d{4})$/
  const match = dateString.match(pattern)
  if (!match) return null
  const [_, dayStr, monthStr, yearStr] = match
  const day = parseInt(dayStr, 10)
  const month = parseInt(monthStr, 10)
  const year = parseInt(yearStr, 10)
  return { day, month, year }
}
const isValidDateString = (dateString: string): boolean => {
  if (typeof dateString === 'number') return false
  const dateStringFormatted = decunstructDateString(dateString)
  if (!dateStringFormatted) return false

  const date = new Date(
    dateStringFormatted.year,
    dateStringFormatted.month - 1,
    dateStringFormatted.day,
  )

  return (
    date.getFullYear() === dateStringFormatted.year &&
    date.getMonth() === dateStringFormatted.month - 1 &&
    date.getDate() === dateStringFormatted.day
  )
}

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

      if (
        isValidDateString(keyA as string) &&
        isValidDateString(keyB as string)
      ) {
        const dayA = decunstructDateString(keyA as string)
        const dayB = decunstructDateString(keyB as string)
        if (!dayA || !dayB) return 0
        const dateA = new Date(dayA.year, dayA.month - 1, dayA.day)
        const dateB = new Date(dayB.year, dayB.month - 1, dayB.day)

        return (dateA.getTime() - dateB.getTime()) * multiplier
      } else if (typeof keyA === 'string' && typeof keyB === 'string') {
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
