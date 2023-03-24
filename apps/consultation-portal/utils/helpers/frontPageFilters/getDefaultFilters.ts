import { FilterInputItems, PeriodInput } from '../../../types/interfaces'

interface Props {
  sorting: Array<FilterInputItems>
  caseStatuses: Array<FilterInputItems>
  caseTypes: Array<FilterInputItems>
  allPolicyAreas: Array<number>
  allInstitutions: Array<number>
  period: PeriodInput
}

export const getDefaultFilters = ({
  sorting,
  caseStatuses,
  caseTypes,
  allPolicyAreas,
  allInstitutions,
  period,
}: Props) => {
  if (typeof window !== 'undefined') {
    const filtersFromLocalStorage = localStorage.getItem('filtersFrontPage')
    if (filtersFromLocalStorage) {
      return JSON.parse(filtersFromLocalStorage)
    }
  }
  const filters = {
    searchQuery: '',
    sorting: { items: sorting, isOpen: true },
    caseStatuses: { items: caseStatuses, isOpen: true },
    caseTypes: { items: caseTypes, isOpen: true },
    policyAreas: allPolicyAreas,
    institutions: allInstitutions,
    period: period,
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem('filtersFrontPage', JSON.stringify(filters))
  }
  return filters
}

export default getDefaultFilters
