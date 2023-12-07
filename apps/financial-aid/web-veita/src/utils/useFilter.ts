import { useState } from 'react'
import {
  ApplicationState,
  FilterType,
} from '@island.is/financial-aid/shared/lib'

export interface Filters {
  applicationState: ApplicationState[]
  staff: string[]
}

const useFilter = () => {
  const [currentPage, setCurrentPage] = useState<number>(1)

  const [activeFilters, setActiveFilters] = useState<Filters>({
    applicationState: [],
    staff: [],
  })

  // const [activeFilters, setActiveFilters] = useState<Filters>({
  //   applicationState: router?.query?.state
  //     ? ((router?.query?.state as string).split(',') as ApplicationState[])
  //     : [],
  //   staff: router?.query?.staff
  //     ? ((router?.query?.staff as string).split(',') as string[])
  //     : [],
  // })

  const onFilterClear = () => {
    setActiveFilters({ applicationState: [], staff: [] })
    setCurrentPage(1)
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
  }
}
export default useFilter
