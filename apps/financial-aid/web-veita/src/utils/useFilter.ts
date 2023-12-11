import { useState } from 'react'
import {
  ApplicationState,
  FilterType,
} from '@island.is/financial-aid/shared/lib'
import { NextRouter } from 'next/router'
export interface PeriodFilter {
  from?: Date
  to?: Date
}
export interface Filters {
  applicationState: ApplicationState[]
  staff: string[]
  period: PeriodFilter
}

const useFilter = (router: NextRouter, minDateCreated?: string) => {
  const fromMinDate = minDateCreated ? new Date(minDateCreated) : undefined

  const [currentPage, setCurrentPage] = useState<number>(
    router?.query?.page ? parseInt(router.query.page as string) : 1,
  )
  const [activeFilters, setActiveFilters] = useState<Filters>({
    applicationState: [],
    staff: [],
    period: {
      from: fromMinDate,
      to: new Date(),
    },
  })

  const onFilterClear = () => {
    setActiveFilters({
      applicationState: [],
      staff: [],
      period: {
        from: fromMinDate,
        to: new Date(),
      },
    })
    setCurrentPage(1)
  }

  const onClearFilterOrFillFromRoute = () => {
    if (router?.query?.state || router?.query?.staff) {
      setActiveFilters((prev) => ({
        ...prev,
        applicationState: router?.query?.state
          ? ((router?.query?.state as string).split(',') as ApplicationState[])
          : [],
        staff: router?.query?.staff
          ? ((router?.query?.staff as string).split(',') as string[])
          : [],
      }))
    } else {
      onFilterClear()
    }
  }

  const handleDateChange = (period: PeriodFilter) => {
    const update = { ...activeFilters.period, ...period }
    setActiveFilters((prev) => ({
      ...prev,
      period: update,
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
    onClearFilterOrFillFromRoute,
    handleDateChange,
  }
}
export default useFilter
