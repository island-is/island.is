import {
  Application,
  ApplicationHeaderSortByEnum,
} from '@island.is/financial-aid/shared/lib'
import { useMemo, useState } from 'react'
import { compareLocaleIS } from './sortHelper'

const useSortedApplications = (
  defaultColumn: ApplicationHeaderSortByEnum,
  defaultDirection: 'ascending' | 'descending',
  data: Application[],
) => {
  const [sortConfig, setSortConfig] = useState({
    column: defaultColumn,
    direction: defaultDirection,
  })

  const requestSort = (column: ApplicationHeaderSortByEnum) => {
    let direction: 'ascending' | 'descending' = 'ascending'

    if (sortConfig.column === column && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }

    setSortConfig({ column, direction })
  }

  const isActiveColumn = (column: string) => {
    if (!sortConfig) {
      return false
    }
    return sortConfig.column === column
  }

  const getClassNamesFor = (column: string) => {
    if (!sortConfig) {
      return
    }
    return sortConfig.column === column ? sortConfig.direction : undefined
  }

  const sortedData = useMemo(() => {
    if (sortConfig && data) {
      return [...data].sort((a, b) => {
        const getColumnValue = (application: Application): string => {
          if (sortConfig.column === 'staff') {
            if (!application?.staff) {
              return ''
            }
            return application?.staff.name ?? ''
          }
          return application[sortConfig.column] ?? ''
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

export default useSortedApplications
