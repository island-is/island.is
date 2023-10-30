import { type FC, type MouseEventHandler, useContext, useEffect, useState } from 'react'
import { useQueryState } from 'next-usequerystate'

import { FilterInput, type FilterInputProps } from '@island.is/island-ui/core'
import { GlobalContext } from '@island.is/web/context'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'

type QueryFilterInputProps = {
  shallow?: boolean
}

const QueryFilterInput: FC<QueryFilterInputProps> = (props) => {
  const { shallow } = props
  const { globalNamespace } = useContext(GlobalContext)
  const n = useNamespace(globalNamespace)
  const { query, setQuery } = useQueryFilter(shallow)
  const [value, setValue] = useState<string>('')

  const handleKeyDown: FilterInputProps['onKeyDown'] = (event) => {
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
      button={{
        onClick: () =>  setQuery(value || null),
        label: 'Search',
      }}
    />
  )
}

function useQueryFilter(shallow = false) {
  const [query, setQuery] = useQueryState('q', { shallow })

  const reset = () => {
    setQuery(null)
  }

  return { query, setQuery, reset }
}

export { QueryFilterInput, useQueryFilter }
export type { QueryFilterInputProps }
