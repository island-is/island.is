import { CaseFilter } from '../../../types/interfaces'
import { FILTERS_FRONT_PAGE_KEY } from '../../consts/consts'
import { getItem, setItem } from '../localStorage'

interface Props {
  filters: CaseFilter
}

export const getFiltersFromLocalStorage = ({ filters }: Props) => {
  const filtersFromLS = getItem({ key: FILTERS_FRONT_PAGE_KEY })
  if (filtersFromLS) {
    return filtersFromLS
  }

  setItem({ key: FILTERS_FRONT_PAGE_KEY, value: filters })
  return filters
}

export default getFiltersFromLocalStorage
