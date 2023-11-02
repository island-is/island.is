import { useMemo, useState } from 'react'

import { CaseListEntry } from '@island.is/judicial-system/types'
import { sortableTableColumn } from '@island.is/judicial-system-web/src/types'
import { compareLocaleIS } from '@island.is/judicial-system-web/src/utils/sortHelper'

const useSortCases = (
  defaultColumn: string,
  defaultDirection: 'ascending' | 'descending',
  data: CaseListEntry[],
) => {
  const [sortConfig, setSortConfig] = useState({
    column: defaultColumn,
    direction: defaultDirection,
  })

  const requestSort = (column: string) => {
    let direction: 'ascending' | 'descending' = 'ascending'

    if (sortConfig.column === column && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }

    setSortConfig({ column, direction })
  }

  const getClassNamesFor = (column: string) => {
    if (!sortConfig) {
      return
    }
    return sortConfig.column === column ? sortConfig.direction : undefined
  }

  const isActiveColumn = (column: sortableTableColumn) => {
    if (!sortConfig) {
      return false
    }
    return sortConfig.column === column
  }

  const sortedData = useMemo(() => {
    if (sortConfig && data) {
      return [...data].sort((a, b) => {
        const getColumnValue = (entry: CaseListEntry) => {
          if (
            sortConfig.column === 'defendant' &&
            entry.defendants &&
            entry.defendants.length > 0
          ) {
            return entry.defendants[0].name ?? ''
          }
          return entry.created
        }

        const compareResult = compareLocaleIS(
          getColumnValue(a),
          getColumnValue(b),
        )

        return sortConfig.direction === 'ascending'
          ? compareResult
          : -compareResult
      })
    }
    return data
  }, [data, sortConfig])

  return { sortedData, requestSort, getClassNamesFor, isActiveColumn }
}

export default useSortCases
