import { useLazyQuery } from '@apollo/client'
import { useState } from 'react'
import {
  AlertMessage,
  AsyncSearchInput,
  Box,
  Text,
} from '@island.is/island-ui/core'
import {
  ConnectedComponent,
  Query,
  QueryPlateAvailableArgs,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { PLATE_AVAILABLE_SEARCH_QUERY } from '@island.is/web/screens/queries/PublicVehicleSearch'

import * as styles from './PlateAvailableSearch.css'

interface PlateAvailableSearchProps {
  slice: ConnectedComponent
}

const PlateAvailableSearch = ({ slice }: PlateAvailableSearchProps) => {
  const n = useNamespace(slice?.json ?? {})
  const [hasFocus, setHasFocus] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [
    shouldDisplayValidationError,
    setShouldDisplayValidationError,
  ] = useState(false)

  const [search, { data, error, loading }] = useLazyQuery<
    Query,
    QueryPlateAvailableArgs
  >(PLATE_AVAILABLE_SEARCH_QUERY)

  const handleSearch = () => {
    if (searchValue.length < 2 || searchValue.length > 6) {
      setShouldDisplayValidationError(true)
      return
    }
    setShouldDisplayValidationError(false)
    search({
      variables: { input: { regno: searchValue } },
    })
  }

  return (
    <Box>
      <Text>
        {n('aboveText', 'Hér má athuga hvort tiltekið einkanúmer sé laust')}
      </Text>
      <Box marginBottom={3}>
        <AsyncSearchInput
          buttonProps={{
            onClick: handleSearch,
            onFocus: () => setHasFocus(true),
            onBlur: () => setHasFocus(false),
          }}
          inputProps={{
            name: 'plate-available-search',
            inputSize: 'large',
            placeholder: n('inputPlaceholder', 'Leita að einkanúmeri'),
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
          loading={loading}
          hasError={shouldDisplayValidationError}
        />
      </Box>
      {!loading && error && (
        <AlertMessage
          type="error"
          title={n('errorOccurredTitle', 'Villa kom upp')}
          message={n(
            'errorOccurredMessage',
            'Ekki tókst að upplýsingar um einkanúmer',
          )}
        />
      )}
      {shouldDisplayValidationError && (
        <Text variant="small">
          <span className={styles.bold}>{n('attention', 'Athugið:')} </span>
          {n(
            'regnoValidationText',
            'Einkanúmer mega vera 2-6 íslenskir stafir eða tölur, og eitt bil að auki, en mega ekki líkjast venjulegum skráningarnúmerum.',
          )}
        </Text>
      )}
      {data &&
        data?.plateAvailable?.regno &&
        data?.plateAvailable?.available && (
          <Text>
            {(n('a', 'Merkið {{ENTERED_NUMBER}} er laust') as string).replace(
              '{{ENTERED_NUMBER}}',
              data?.plateAvailable?.regno,
            )}
          </Text>
        )}
      {data &&
        data?.plateAvailable?.regno &&
        !data?.plateAvailable?.available && (
          <Text>
            {(n(
              'ee',
              'Merkið {{ENTERED_NUMBER}} er í notkun og ekki laust til úthlutunar',
            ) as string).replace(
              '{{ENTERED_NUMBER}}',
              data?.plateAvailable?.regno,
            )}
          </Text>
        )}
    </Box>
  )
}

export default PlateAvailableSearch
