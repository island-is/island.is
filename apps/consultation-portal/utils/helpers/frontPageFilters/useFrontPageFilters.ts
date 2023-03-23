import getDefaultFilters from './getDefaultFilters'
import getInitFilterValues from './getInitFilterValues'
import {
  ArrOfTypes,
  CaseFilter,
  FilterInputItems,
} from '../../../types/interfaces'
import { useEffect, useState } from 'react'
import { CaseSortOptions } from '../../../types/enums'
import useFetchCases from '../useFetchCases'

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
    caseStatuses: filters.caseStatuses.items
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
    const insertFilterCount = setTimeout(() => {
      if (filterGroups && !getCasesLoading) {
        const caseTypesList = filterGroups?.CaseTypes
          ? Object.entries(filterGroups.CaseTypes).map(([value, count]) => ({
              value,
              count,
            }))
          : []

        const caseTypesMerged = filters.caseTypes.items.map((item) => ({
          ...item,
          ...caseTypesList.find((val) => val.value === item.value),
        }))

        const caseStatusesList = filterGroups?.Statuses
          ? Object.entries(filterGroups.Statuses).map(([value, count]) => ({
              value,
              count,
            }))
          : []
        const caseStatusesMerged = filters.caseStatuses.items.map((item) => ({
          ...item,
          ...caseStatusesList.find((val) => val.value === item.value),
        }))

        const filtersCopy = { ...filters }
        filtersCopy.caseTypes.items = caseTypesMerged
        filtersCopy.caseStatuses.items = caseStatusesMerged
        setFilters(filtersCopy)
      }
    }, 500)

    return () => {
      clearTimeout(insertFilterCount)
    }
  }, [filterGroups])

  return {
    cases,
    filterGroups,
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
