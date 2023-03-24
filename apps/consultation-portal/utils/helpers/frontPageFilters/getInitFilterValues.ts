import { CaseSortOptions } from '../../../types/enums'
import { ArrOfTypes } from '../../../types/interfaces'

const TODAY = new Date()

interface Props {
  types: ArrOfTypes
}

export const getInitFilterValues = ({ types }: Props) => {
  const caseStatuses = Object.entries(types.caseStatuses)
    .map(([value, label]) => ({
      value,
      label,
    }))
    .map((item) => ({ ...item, checked: true }))

  const caseTypes = Object.entries(types.caseTypes)
    .map(([value, label]) => ({
      value,
      label,
    }))
    .map((item) => ({ ...item, checked: true }))

  const Institutions = Object.entries(types.institutions).map(
    ([value, label]) => ({
      value,
      label,
    }),
  )

  const allInstitutions = Institutions.map((item) => parseInt(item.value))

  const PolicyAreas = Object.entries(types.policyAreas).map(
    ([value, label]) => ({
      value,
      label,
    }),
  )

  const allPolicyAreas = PolicyAreas.map((item) => parseInt(item.value))

  const sorting = [
    {
      value: '0',
      label: CaseSortOptions.lastUpdated,
      checked: true,
    },
    {
      value: '1',
      label: CaseSortOptions.latestCases,
      checked: false,
    },
    {
      value: '2',
      label: CaseSortOptions.adviceDeadline,
      checked: false,
    },
  ]

  const period = {
    from: new Date(2018, 1, 2),
    to: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()),
  }

  const filters = {
    caseStatuses: caseStatuses,
    caseTypes: caseTypes,
    Institutions: Institutions,
    allInstitutions: allInstitutions,
    PolicyAreas: PolicyAreas,
    allPolicyAreas: allPolicyAreas,
    sorting: sorting,
    period: period,
  }

  return filters
}

export default getInitFilterValues
