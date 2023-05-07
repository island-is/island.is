import { setItem } from '../../utils/helpers/localStorage'
import { useDebounce } from '../../utils/helpers'
import { Input } from '@island.is/island-ui/core'
import { BaseSyntheticEvent, useState } from 'react'
import {
  AdviceFilter,
  CaseFilter,
} from '@island.is/consultation-portal/types/interfaces'

interface Props {
  filters: CaseFilter | AdviceFilter
  setFilters: (arr: CaseFilter | AdviceFilter) => void
  name: string
  localStorageId: string
  label?: string
}

export const DebouncedSearch = ({
  filters,
  setFilters,
  name,
  localStorageId,
  label = 'Leit',
}: Props) => {
  const [value, setValue] = useState(filters?.searchQuery)

  const debouncedHandleSearch = useDebounce(() => {
    const filtersCopy = { ...filters }
    filtersCopy.searchQuery = value
    filtersCopy.pageNumber = 0
    setItem({ key: localStorageId, value: filtersCopy })
    setFilters(filtersCopy)
  }, 500)

  const onChange = (e: BaseSyntheticEvent) => {
    const searchValue = e.target.value
    setValue(searchValue)
    debouncedHandleSearch()
  }

  return (
    <Input
      name={name}
      label={label}
      size="xs"
      placeholder="Að hverju ertu að leita?"
      value={value}
      onChange={onChange}
    />
  )
}

export default DebouncedSearch
