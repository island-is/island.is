import { useState } from 'react'
import { AdviceFilter } from '../../../types/interfaces'
import getDefaultFilters from './getDefaultFilters'
import { useFetchAdvices } from '../useFetchAdvices'

interface Props {
  cards_per_page: number
  page: number
}

export const useAdviceFilters = ({ cards_per_page, page }: Props) => {
  const defaultValues = getDefaultFilters()

  const [filters, setFilters] = useState<AdviceFilter>({
    ...defaultValues,
  })

  const input = {
    oldestFirst: filters.oldestFirst,
    pageNumber: page,
    pageSize: cards_per_page,
    searchQuery: filters.searchQuery,
  }

  const { advices, total, getAdvicesLoading } = useFetchAdvices({
    input: input,
  })

  return {
    advices,
    total,
    getAdvicesLoading,
    filters,
    setFilters,
    defaultValues,
  }
}

export default useAdviceFilters
