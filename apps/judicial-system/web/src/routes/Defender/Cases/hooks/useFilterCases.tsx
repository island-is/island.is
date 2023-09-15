import { useEffect, useMemo, useState } from 'react'

import {
  CaseListEntry,
  isIndictmentCase,
} from '@island.is/judicial-system/types'

export interface Filters {
  indictmentCaseFilter: boolean
  investigationCaseFilter: boolean
}

const useFilterCases = (cases: CaseListEntry[]) => {
  const [filters, setFilters] = useState<Filters>({
    indictmentCaseFilter: true,
    investigationCaseFilter: true,
  })

  const filteredCases = useMemo(() => {
    const { indictmentCaseFilter, investigationCaseFilter } = filters

    if (indictmentCaseFilter && investigationCaseFilter) {
      return cases
    }

    return cases.filter((theCase) => {
      if (indictmentCaseFilter) {
        return isIndictmentCase(theCase.type)
      } else if (investigationCaseFilter) {
        return !isIndictmentCase(theCase.type)
      }
      return false
    })
  }, [filters, cases])

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

export default useFilterCases
