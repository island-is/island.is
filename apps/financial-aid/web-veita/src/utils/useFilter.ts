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

const useFilter = (router: NextRouter) => {
  const [currentPage, setCurrentPage] = useState<number>(
    router?.query?.page ? parseInt(router.query.page as string) : 1,
  )
  const [activeFilters, setActiveFilters] = useState<Filters>({
    applicationState: [],
    staff: [],
    period: {
      from: undefined,
      to: new Date(),
    },
  })

  const onFilterClear = () => {
    setActiveFilters((prev) => ({
      ...prev,
      applicationState: [],
      staff: [],
    }))
  }

  const onFilterClearAll = () => {
    setActiveFilters({
      applicationState: [],
      staff: [],
      period: {
        from: undefined,
        to: new Date(),
      },
    })
    setCurrentPage(1)
  }

  const onClearFilterOrFillFromRoute = () => {
    if (
      router?.query?.state ||
      router?.query?.staff ||
      router?.query?.periodTo ||
      router?.query?.periodFrom
    ) {
      setActiveFilters((prev) => ({
        ...prev,
        applicationState: router?.query?.state
          ? ((router?.query?.state as string).split(',') as ApplicationState[])
          : [],
        staff: router?.query?.staff
          ? ((router?.query?.staff as string).split(',') as string[])
          : [],
        period: {
          from: router?.query?.periodFrom
            ? new Date(router?.query?.periodFrom as string)
            : undefined,
          to: router?.query?.periodTo
            ? new Date(router?.query?.periodTo as string)
            : new Date(),
        },
      }))
    } else {
      onFilterClearAll()
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
    onFilterClearAll,
  }
}
export default useFilter
