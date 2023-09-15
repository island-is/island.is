import { AdviceFilter } from '../../../types/interfaces'
import { FILTERS_ADVICE_KEY } from '../../consts/consts'
import { getItem, setItem } from '../localStorage'

export const getFiltersFromLocalStorage = (filter: AdviceFilter) => {
  const filtersFromLS = getItem({ key: FILTERS_ADVICE_KEY })
  if (filtersFromLS) {
    return filtersFromLS
  }

  setItem({ key: FILTERS_ADVICE_KEY, value: filter })
  return filter
}

export default getFiltersFromLocalStorage
