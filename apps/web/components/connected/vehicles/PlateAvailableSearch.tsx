import { useLazyQuery } from '@apollo/client'
import { useState } from 'react'
import { AsyncSearchInput, Box } from '@island.is/island-ui/core'
import {
  ConnectedComponent,
  Query,
  QueryPlateAvailableArgs,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { PLATE_AVAILABLE_SEARCH_QUERY } from '@island.is/web/screens/queries/PublicVehicleSearch'

interface PlateAvailableSearchProps {
  slice: ConnectedComponent
}

const PlateAvailableSearch = ({ slice }: PlateAvailableSearchProps) => {
  const n = useNamespace(slice?.json ?? {})
  const [hasFocus, setHasFocus] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const [search, { data, error, loading }] = useLazyQuery<
    Query['plateAvailable'],
    QueryPlateAvailableArgs
  >(PLATE_AVAILABLE_SEARCH_QUERY)

  const handleSearch = () => {
    search({
      variables: { input: { regno: searchValue } },
    })
  }

  return (
    <Box>
      <Box marginTop={2} marginBottom={3}>
        <AsyncSearchInput
          buttonProps={{
            onClick: handleSearch,
            onFocus: () => setHasFocus(true),
            onBlur: () => setHasFocus(false),
          }}
          inputProps={{
            name: 'public-vehicle-search',
            inputSize: 'large',
            placeholder: n('inputPlaceholder', 'Leita í ökutækjaskrá'),
            colored: true,
            onChange: (ev) => setSearchValue(ev.target.value.toUpperCase()),
            value: searchValue,
            onKeyDown: (ev) => {
              if (ev.key === 'Enter') {
                handleSearch()
              }
            },
          }}
          hasFocus={hasFocus}
          rootProps={{}}
          loading={loading}
        />
      </Box>
      {JSON.stringify(data || error)}
    </Box>
  )
}

export default PlateAvailableSearch
