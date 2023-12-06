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

const useFilter = (router: NextRouter) => {
  const [currentPage, setCurrentPage] = useState<number>(
    router?.query?.page ? parseInt(router.query.page as string) : 1,
  )

  const [activeFilters, setActiveFilters] = useState<Filters>({
    applicationState: router?.query?.state
      ? ((router?.query?.state as string).split(',') as ApplicationState[])
      : [],
    staff: [],
  })

  const onClearFilter = () => {
    setActiveFilters({ applicationState: [], staff: [] })
    setCurrentPage(1)
  }

  const onChecked = (
    filter: ApplicationState | string,
    checked: boolean,
    filterType: FilterType,
  ) => {
    if (checked) {
      // If checked, add the filter to the specified array
      setActiveFilters({
        ...activeFilters,
        [filterType]: [...activeFilters[filterType], filter],
      })
    } else {
      // If unchecked, filter out the filter from the specified array
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
    onClearFilter,
  }
}
export default useFilter
