import { useContext, useState, useEffect, type FC } from 'react'
import { FilterInput, type FilterInputProps } from '@island.is/island-ui/core'
import { useQueryState } from 'next-usequerystate'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { GlobalContext } from '@island.is/web/context'

const QueryFilterInput: FC = () => {
  const { globalNamespace } = useContext(GlobalContext)
  const n = useNamespace(globalNamespace)
  const { query, setQuery } = useQueryFilter()
  const [value, setValue] = useState<string>('')

  const handleKeyDown: FilterInputProps['onKeyDown'] = (event) => {
    const { value } = event.currentTarget

    if (event.key === 'Enter') {
      event.currentTarget.blur()
      setQuery(value || null)
    }
  }

  useEffect(() => {
    setValue(query ?? '')
  }, [query])

  return (
    <FilterInput
      name="filter-input"
      placeholder={n('filterInputPlaceholder', 'Sía eftir leitarorði')}
      value={value}
      onChange={setValue}
      onKeyDown={handleKeyDown}
    />
  )
}

function useQueryFilter() {
  const [query, setQuery] = useQueryState('q', { shallow: false })

  const reset = () => {
    setQuery(null)
  }

  return { query, setQuery, reset }
}

export { QueryFilterInput, useQueryFilter }
