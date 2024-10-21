import { useCallback, useMemo, useState } from 'react'

import { compareLocaleIS } from '../../sortHelper'

type SortDirection = 'ascending' | 'descending'

interface SortConfig<T> {
  column: keyof T
  direction: SortDirection
}

const useSort = <T>(
  defaultColumn: keyof T,
  defaultDirection: SortDirection,
  data: T[],
  getColumnValue: (entry: T, column: keyof T) => string | null | undefined,
) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    column: defaultColumn,
    direction: defaultDirection,
  })

  const requestSort = useCallback((column: keyof T) => {
    setSortConfig((prevConfig) => ({
      column,
      direction:
        prevConfig.column === column && prevConfig.direction === 'ascending'
          ? 'descending'
          : 'ascending',
    }))
  }, [])

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const compareResult = compareLocaleIS(
        getColumnValue(a, sortConfig.column),
        getColumnValue(b, sortConfig.column),
      )
      return sortConfig.direction === 'ascending'
        ? compareResult
        : -compareResult
    })
  }, [data, sortConfig, getColumnValue])

  const getClassNamesFor = useCallback(
    (column: keyof T) =>
      sortConfig.column === column ? sortConfig.direction : undefined,
    [sortConfig],
  )

  const isActiveColumn = useCallback(
    (column: keyof T) => sortConfig.column === column,
    [sortConfig],
  )

  return { sortedData, requestSort, getClassNamesFor, isActiveColumn }
}

export default useSort
