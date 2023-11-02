import { FilterInputItem, PeriodInput } from '../../../types/interfaces'
import { CARDS_PER_PAGE } from '../../consts/consts'

interface Props {
  sorting: Array<FilterInputItem>
  caseStatuses: Array<FilterInputItem>
  caseTypes: Array<FilterInputItem>
  allPolicyAreas: Array<number>
  allInstitutions: Array<number>
  period: PeriodInput
}

export const getInitialFilters = ({
  sorting,
  caseStatuses,
  caseTypes,
  allPolicyAreas,
  allInstitutions,
  period,
}: Props) => {
  const filters = {
    searchQuery: '',
    sorting: { items: sorting, isOpen: true },
    caseStatuses: { items: caseStatuses, isOpen: true },
    caseTypes: { items: caseTypes, isOpen: true },
    policyAreas: allPolicyAreas,
    institutions: allInstitutions,
    period: period,
    pageNumber: 0,
    pageSize: CARDS_PER_PAGE,
  }
  return filters
}
