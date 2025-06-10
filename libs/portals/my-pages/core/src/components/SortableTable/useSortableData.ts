import { useMemo, useState } from 'react'
import React from 'react'
import { ConfigType } from './types'

const isReactElement = (value: unknown): value is React.ReactElement =>
  React.isValidElement(value)

const extractTextFromHtml = (html: string): string => {
  const div = document.createElement('div')
  div.innerHTML = html
  const anchor = div.querySelector('a')
  return (anchor?.textContent ?? div.textContent ?? '').trim()
}

const extractComparableString = (value: unknown): string => {
  if (isReactElement(value)) {
    return value.props?.text?.toString?.() ?? ''
  }
  if (typeof value === 'string') {
    if (/<a\s/i.test(value)) {
      return extractTextFromHtml(value)
    }
    return value
  }
  return ''
}

// Matches known is dateformats
const dateRegex = /\b(\d{1,2})\.(\d{1,2})\.(\d{4})\b/

const parseDate = (value: unknown): Date | null => {
  if (typeof value !== 'string') return null
  const match = value.match(dateRegex)
  if (!match) return null
  const [, d, m, y] = match.map(Number)
  const date = new Date(y, m - 1, d)
  // Validate round-trip
  return date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
    ? date
    : null
}

export const useSortableData = <T extends Record<string, unknown>>(
  items: T[],
  config: ConfigType = { direction: 'ascending', key: '' },
) => {
  const [sortConfig, setSortConfig] = useState<ConfigType>(config)

  const sortedItems = useMemo(() => {
    if (!sortConfig.key) return items

    return [...items].sort((a, b) => {
      const key = sortConfig.key as keyof T
      const valueA = a[key]
      const valueB = b[key]

      const multiplier = sortConfig.direction === 'ascending' ? 1 : -1

      // Handle date strings
      const dateA = parseDate(valueA)
      const dateB = parseDate(valueB)
      if (dateA && dateB) {
        return (dateA.getTime() - dateB.getTime()) * multiplier
      }

      // Handle numbers
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return (valueA - valueB) * multiplier
      }

      // Handle strings and React elements
      const strA = extractComparableString(valueA)
      const strB = extractComparableString(valueB)

      return strA.localeCompare(strB, undefined, { numeric: true }) * multiplier
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
