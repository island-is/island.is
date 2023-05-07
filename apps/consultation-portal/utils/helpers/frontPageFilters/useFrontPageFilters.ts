import getDefaultFilters from './getDefaultFilters'
import getInitFilterValues from './getInitFilterValues'
import {
  ArrOfTypes,
  CaseFilter,
  FilterInputItem,
} from '../../../types/interfaces'
import { useEffect, useState } from 'react'
import { CaseSortOptions } from '../../../types/enums'
import useFetchCases from '../useFetchCases'
import mapListToValueCountObject from './mapObjectToValueCountObject'
import isObjectEmpty from '../isObjectEmpty'
import getFilteredItemsOrAll from './getFilteredItemsOrAll'
import { setItem } from '../localStorage'
import { FILTERS_FRONT_PAGE_KEY } from '../../consts/consts'
import { getInitialFilters } from './getInitialFilters'

interface Props {
  types: ArrOfTypes
}

export const useFrontPageFilters = ({ types }: Props) => {
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

  const initialValues = getInitialFilters({
    sorting: sorting,
    caseStatuses: caseStatuses,
    caseTypes: caseTypes,
    allPolicyAreas: allPolicyAreas,
    allInstitutions: allInstitutions,
    period: period,
  })

  const defaultValues = getDefaultFilters({ initialValues: initialValues })

  const [filters, setFilters] = useState<CaseFilter>({
    ...defaultValues,
  })

  const _caseStatuses = getFilteredItemsOrAll({
    items: [...filters?.caseStatuses?.items],
    defaultItems: initialValues?.caseStatuses?.items,
  })

  const _caseTypes = getFilteredItemsOrAll({
    items: [...filters?.caseTypes?.items],
    defaultItems: initialValues?.caseTypes?.items,
  })

  const input = {
    caseStatuses: _caseStatuses,
    caseTypes: _caseTypes,
    orderBy: Object.keys(CaseSortOptions).find(
      (key) =>
        CaseSortOptions[key] ===
        filters.sorting.items.filter((item: FilterInputItem) => item.checked)[0]
          .label,
    ),
    searchQuery: filters.searchQuery,
    policyAreas: filters.policyAreas,
    institutions: filters.institutions,
    dateFrom: filters.period.from,
    dateTo: filters.period.to,
    pageSize: filters.pageSize,
    pageNumber: filters.pageNumber,
  }

  const { cases, filterGroups, total, getCasesLoading } = useFetchCases({
    input: input,
  })

  useEffect(() => {
    if (!isObjectEmpty(filterGroups) && !getCasesLoading) {
      const caseTypesList = mapListToValueCountObject(filterGroups.CaseTypes)
      const caseTypesMerged = filters.caseTypes.items.map((item) => ({
        ...item,
        ...(caseTypesList.find((val) => val.value === item.value) || {
          count: 0,
        }),
      }))

      const caseStatusesList = mapListToValueCountObject(filterGroups.Statuses)
      const caseStatusesMerged = filters.caseStatuses.items.map((item) => ({
        ...item,
        ...(caseStatusesList.find((val) => val.value === item.value) || {
          count: 0,
        }),
      }))

      const filtersCopy = { ...filters }
      filtersCopy.caseTypes.items = caseTypesMerged
      filtersCopy.caseStatuses.items = caseStatusesMerged

      setItem({ key: FILTERS_FRONT_PAGE_KEY, value: filtersCopy })
      setFilters(filtersCopy)
    }
  }, [filterGroups])

  return {
    cases: cases,
    total: total,
    getCasesLoading: getCasesLoading,
    PolicyAreas: PolicyAreas,
    allPolicyAreas: allPolicyAreas,
    Institutions: Institutions,
    allInstitutions: allInstitutions,
    filters: filters,
    setFilters: setFilters,
    initialValues: initialValues,
  }
}
