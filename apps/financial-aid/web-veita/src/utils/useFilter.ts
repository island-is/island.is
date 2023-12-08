import { useState } from 'react'
import {
  ApplicationState,
  FilterType,
} from '@island.is/financial-aid/shared/lib'
import { NextRouter } from 'next/router'

export interface Filters {
  applicationState: ApplicationState[]
  staff: string[]
}

export interface PeriodFilter {
  from?: Date
  to?: Date
}

const useFilter = (router: NextRouter) => {
  const [currentPage, setCurrentPage] = useState<number>(
    router?.query?.page ? parseInt(router.query.page as string) : 1,
  )
  const [activeFilters, setActiveFilters] = useState<Filters>({
    applicationState: [],
    staff: [],
  })

  const [period, setPeriod] = useState<PeriodFilter>({
    from: undefined,
    to: new Date(),
  })

  const onFilterClear = () => {
    setActiveFilters({
      applicationState: [],
      staff: [],
    })
    setCurrentPage(1)
  }

  const ClearFilterOrFillFromRoute = () => {
    if (router?.query?.state || router?.query?.staff) {
      setActiveFilters({
        applicationState: router?.query?.state
          ? ((router?.query?.state as string).split(',') as ApplicationState[])
          : [],
        staff: router?.query?.staff
          ? ((router?.query?.staff as string).split(',') as string[])
          : [],
      })
    } else {
      onFilterClear()
    }
  }

  const handleDateChange = (period: PeriodFilter) => {
    setPeriod((prev) => ({
      ...prev,
      ...period,
    }))
  }

  const onChecked = (
    filter: ApplicationState | string,
    checked: boolean,
    filterType: FilterType,
  ) => {
    if (checked) {
      setActiveFilters({
        ...activeFilters,
        [filterType]: [...activeFilters[filterType], filter],
      })
    } else {
      setActiveFilters({
        ...activeFilters,
        [filterType]: activeFilters[filterType].filter(
          (state) => state !== filter,
        ),
      })
    }
  }

  return {
    currentPage,
    setCurrentPage,
    activeFilters,
    setActiveFilters,
    onChecked,
    onFilterClear,
    ClearFilterOrFillFromRoute,
    period,
    setPeriod,
    handleDateChange,
  }
}
export default useFilter
