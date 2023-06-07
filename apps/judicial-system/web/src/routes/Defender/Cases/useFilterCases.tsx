import { useState, useEffect, useCallback } from 'react'

import {
  CaseListEntry,
  isIndictmentCase,
} from '@island.is/judicial-system/types'

export function useFilterCases(
  cases: CaseListEntry[],
  sortedData: CaseListEntry[],
) {
  const [filteredCases, setFilteredCases] = useState<CaseListEntry[]>(
    sortedData,
  )
  const [indictmentCaseFilter, setIndictmentCaseFilter] = useState<boolean>(
    true,
  )
  const [
    investigationCaseFilter,
    setInvestigationCaseFilter,
  ] = useState<boolean>(true)

  const getFilteredCases = useCallback(() => {
    if (indictmentCaseFilter && investigationCaseFilter) {
      return sortedData
    } else if (indictmentCaseFilter) {
      return sortedData.filter((theCase) => isIndictmentCase(theCase.type))
    } else if (investigationCaseFilter) {
      return sortedData.filter((theCase) => !isIndictmentCase(theCase.type))
    } else {
      return []
    }
  }, [indictmentCaseFilter, investigationCaseFilter, sortedData])

  useEffect(() => {
    const filteredCases = getFilteredCases()
    setFilteredCases(filteredCases)
  }, [cases, getFilteredCases])

  return {
    filteredCases,
    indictmentCaseFilter,
    investigationCaseFilter,
    toggleIndictmentCases: () => setIndictmentCaseFilter(!indictmentCaseFilter),
    toggleInvestigationCases: () =>
      setInvestigationCaseFilter(!investigationCaseFilter),
  }
}
