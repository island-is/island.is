import { useState, useEffect, useMemo } from 'react'
import {
  CaseListEntry,
  isIndictmentCase,
} from '@island.is/judicial-system/types'

export function useFilterCases(
  cases: CaseListEntry[],
  sortedData: CaseListEntry[],
) {
  const [filters, setFilters] = useState({
    indictmentCaseFilter: true,
    investigationCaseFilter: true,
  })

  const filteredCases = useMemo(() => {
    const { indictmentCaseFilter, investigationCaseFilter } = filters

    if (indictmentCaseFilter && investigationCaseFilter) {
      return sortedData
    }

    return sortedData.filter((theCase) => {
      if (indictmentCaseFilter) {
        return isIndictmentCase(theCase.type)
      } else if (investigationCaseFilter) {
        return !isIndictmentCase(theCase.type)
      }
      return false
    })
  }, [filters, sortedData])

  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
    }))
  }, [cases])

  const toggleFilter = (filter: keyof typeof filters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: !prevFilters[filter] as boolean,
    }))
  }

  return {
    filteredCases,
    filters,
    toggleFilter,
  }
}
