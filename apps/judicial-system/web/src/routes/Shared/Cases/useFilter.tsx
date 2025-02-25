import { useCallback, useEffect, useMemo, useState } from 'react'
import { IntlShape, useIntl } from 'react-intl'

import {
  isIndictmentCase,
  isInvestigationCase,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import {
  CaseListEntry,
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { useFilter as m } from './useFilter.strings'

export type Filter = 'ALL_CASES' | 'MY_CASES' | 'INVESTIGATION' | 'INDICTMENT'
export type FilterOption = { label: string; value: Filter }
const filterOptions = (
  formatMessage: IntlShape['formatMessage'],
): FilterOption[] => [
  {
    label: formatMessage(m.allCases),
    value: 'ALL_CASES',
  },
  {
    label: formatMessage(m.investicationCases),
    value: 'INVESTIGATION',
  },
  {
    label: formatMessage(m.indictmentCases),
    value: 'INDICTMENT',
  },
  {
    label: formatMessage(m.myCases),
    value: 'MY_CASES',
  },
]

const myCasesFilter = (
  theCase: CaseListEntry,
  user: User | undefined,
): boolean => {
  if (!user) {
    return false
  }

  return (
    theCase.judge?.id === user.id ||
    theCase.prosecutor?.id === user.id ||
    theCase.registrar?.id === user.id ||
    theCase.creatingProsecutor?.id === user.id
  )
}

export const filterCases = (
  filter: Filter,
  cases: CaseListEntry[],
  user?: User,
): CaseListEntry[] => {
  if (filter === 'MY_CASES') {
    return cases.filter((c) => myCasesFilter(c, user))
  }

  if (filter === 'INVESTIGATION') {
    return cases.filter(
      (c) => isInvestigationCase(c.type) || isRestrictionCase(c.type),
    )
  }
  if (filter === 'INDICTMENT') {
    return cases.filter((c) => isIndictmentCase(c.type))
  }
  // Filter.value === 'ALL_CASES'
  return cases
}

export const filterOptionsForUser = (
  options: FilterOption[],
  user?: User | undefined,
) => {
  return options.filter((option) => {
    if (user?.role === UserRole.PROSECUTOR_REPRESENTATIVE) {
      return option.value !== 'INVESTIGATION' && option.value !== 'INDICTMENT'
    }

    return true
  })
}

export type UserFilter = {
  filter: FilterOption
  setFilter: (filter: FilterOption) => void
  options: FilterOption[]
  activeCases: CaseListEntry[]
  pastCases: CaseListEntry[]
}

export const useFilter = (
  allActiveCases: CaseListEntry[],
  allPastCases: CaseListEntry[],
  user?: User,
): UserFilter => {
  const { formatMessage } = useIntl()
  const optionsMemo = useMemo(
    () => filterOptionsForUser(filterOptions(formatMessage), user),
    [formatMessage, user],
  )
  const [filter, setFilter] = useState<FilterOption>(optionsMemo[0])

  useEffect(() => {
    const userFilter = localStorage.getItem('casesFilter')
    if (userFilter) {
      const nextFilter =
        optionsMemo
          .filter((option) => (option.value as string) === userFilter)
          .at(0) ?? optionsMemo[0]

      setFilter(nextFilter)
    }
  }, [optionsMemo])

  const setFilterAndStore = useCallback(
    (nextFilter: FilterOption) => {
      setFilter(nextFilter)
      localStorage.setItem('casesFilter', nextFilter.value as string)
    },
    [setFilter],
  )

  const [activeCases, pastCases]: [CaseListEntry[], CaseListEntry[]] = useMemo(
    () => [
      filterCases(filter.value, allActiveCases, user),
      filterCases(filter.value, allPastCases, user),
    ],
    [allActiveCases, allPastCases, filter, user],
  )

  return {
    filter,
    setFilter: setFilterAndStore,
    options: optionsMemo,
    activeCases,
    pastCases,
  }
}
