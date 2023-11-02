import { CaseSortOptions, MapCaseStatuses } from '../../../types/enums'
import { ArrOfTypes } from '../../../types/interfaces'
import { TYPES_ORDER } from '../../consts/consts'

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
    .map((item) => ({
      ...item,
      label: MapCaseStatuses[item.label],
      checked: false,
    }))

  const caseTypes = Object.entries(types.caseTypes)
    .map(([value, label]) => ({
      value,
      label,
    }))
    .map((item) => ({ ...item, checked: false }))

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
    from: new Date(2018, 1, 1),
    to: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()),
  }

  const sortByObject = TYPES_ORDER.reduce((obj, item, index) => {
    return {
      ...obj,
      [item]: index,
    }
  }, {})

  const sortedTypes = caseTypes.sort(
    (a, b) => sortByObject[a.label] - sortByObject[b.label],
  )

  const filters = {
    caseStatuses: caseStatuses,
    caseTypes: sortedTypes,
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
