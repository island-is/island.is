import { useState } from 'react'
import { ApplicationState } from '@island.is/financial-aid/shared/lib'
import { NextRouter } from 'next/router'
interface Filters {
  selectedStates: ApplicationState[]
  selectedMonths: number[]
}

const useFilter = (router: NextRouter) => {
  const [filters, setFilters] = useState<Filters>({
    selectedStates: router?.query?.state
      ? ((router?.query?.state as string).split(',') as ApplicationState[])
      : [],
    selectedMonths: router?.query?.month
      ? (router?.query?.month as string).split(',').map(Number)
      : [],
  })

  return { filters, setFilters }
}
export default useFilter
