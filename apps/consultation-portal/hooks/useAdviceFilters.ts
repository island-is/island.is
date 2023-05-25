import { useEffect, useState } from 'react'
import { AdviceFilter } from '../types/interfaces'
import getFiltersFromLocalStorage from '../utils/helpers/adviceFilters/getFiltersFromLocalStorage'
import { useFetchAdvices } from './api/useFetchAdvices'
import { CARDS_PER_PAGE } from '../utils/consts/consts'

interface Props {
  isAuthenticated: boolean
}

export const useAdviceFilters = ({ isAuthenticated }: Props) => {
  const initialValues = {
    searchQuery: '',
    oldestFirst: false,
    pageSize: CARDS_PER_PAGE,
    pageNumber: 0,
  } as AdviceFilter

  const [filters, setFilters] = useState<AdviceFilter>({
    ...initialValues,
  })

  const { advices, total, getAdvicesLoading } = useFetchAdvices({
    input: filters,
    isAuthenticated: isAuthenticated,
  })

  useEffect(() => {
    const nextFilters = getFiltersFromLocalStorage(filters)
    setFilters(nextFilters)
  }, [])

  return {
    advices,
    total,
    getAdvicesLoading,
    filters,
    setFilters,
    initialValues,
  }
}

export default useAdviceFilters
