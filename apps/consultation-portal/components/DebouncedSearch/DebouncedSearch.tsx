import { useDebounce } from '../../utils/helpers'
import { Input } from '@island.is/island-ui/core'
import { BaseSyntheticEvent, useState } from 'react'

export const DebouncedSearch = ({
  filters,
  setFilters,
  name,
  label = 'Leit',
}) => {
  const [value, setValue] = useState(filters?.searchQuery)

  const debouncedHandleSearch = useDebounce(() => {
    const filtersCopy = { ...filters }
    filtersCopy.searchQuery = value
    filtersCopy.pageNumber = 0
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
