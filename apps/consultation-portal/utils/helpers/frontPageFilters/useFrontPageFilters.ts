import getDefaultFilters from './getDefaultFilters'
import getInitFilterValues from './getInitFilterValues'
import {
  ArrOfTypes,
  CaseFilter,
  FilterInputItems,
  ValueCountPair,
} from '../../../types/interfaces'
import { useEffect, useState } from 'react'
import { CaseSortOptions } from '../../../types/enums'
import useFetchCases from '../useFetchCases'
import mapListToValueCountObject from './mapObjectToValueCountObject'
import isObjectEmpty from '../isObjectEmpty'

interface Props {
  types: ArrOfTypes
  CARDS_PER_PAGE: number
  page: number
}

export const useFrontPageFilters = ({ types, CARDS_PER_PAGE, page }: Props) => {
  const {
    caseStatuses,
    caseTypes,
    Institutions,
    allInstitutions,
    PolicyAreas,
    allPolicyAreas,
    sorting,
    period,
  } = getInitFilterValues({ types: types })

  const defaultValues = getDefaultFilters({
    sorting: sorting,
    caseStatuses: caseStatuses,
    caseTypes: caseTypes,
    allPolicyAreas: allPolicyAreas,
    allInstitutions: allInstitutions,
    period: period,
  })

  const [filters, setFilters] = useState<CaseFilter>({
    ...defaultValues,
  })

  const input = {
    caseStatuses: filters?.caseStatuses?.items
      .filter((item: FilterInputItems) => item.checked)
      .map((item: FilterInputItems) => parseInt(item.value)),
    caseTypes: filters.caseTypes.items
      .filter((item: FilterInputItems) => item.checked)
      .map((item: FilterInputItems) => parseInt(item.value)),
    orderBy: Object.keys(CaseSortOptions).find(
      (key) =>
        CaseSortOptions[key] ===
        filters.sorting.items.filter(
          (item: FilterInputItems) => item.checked,
        )[0].label,
    ),
    searchQuery: filters.searchQuery,
    policyAreas: filters.policyAreas,
    institutions: filters.institutions,
    dateFrom: filters.period.from,
    dateTo: filters.period.to,
    pageSize: CARDS_PER_PAGE,
    pageNumber: page,
  }

  const { cases, filterGroups, total, getCasesLoading } = useFetchCases({
    input: input,
  })

  useEffect(() => {
    if (!isObjectEmpty(filterGroups) && !getCasesLoading) {
      const caseTypesList = mapListToValueCountObject(filterGroups.CaseTypes)
      const caseTypesMerged = filters.caseTypes.items.map(
        (item: ValueCountPair) => ({
          ...item,
          ...(caseTypesList.find((val) => val.value === item.value) || {
            count: 0,
          }),
        }),
      )

      const caseStatusesList = mapListToValueCountObject(filterGroups.Statuses)
      const caseStatusesMerged = filters.caseStatuses.items.map(
        (item: ValueCountPair) => ({
          ...item,
          ...(caseStatusesList.find((val) => val.value === item.value) || {
            count: 0,
          }),
        }),
      )

      const filtersCopy = { ...filters }
      filtersCopy.caseTypes.items = caseTypesMerged
      filtersCopy.caseStatuses.items = caseStatusesMerged

      if (typeof window !== 'undefined') {
        localStorage.setItem('filtersFrontPage', JSON.stringify(filtersCopy))
      }
      setFilters(filtersCopy)
    }
  }, [filterGroups])

  return {
    cases,
    total,
    getCasesLoading,
    PolicyAreas,
    allPolicyAreas,
    Institutions,
    allInstitutions,
    filters,
    setFilters,
    defaultValues,
  }
}
