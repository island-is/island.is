import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useLazyQuery } from '@apollo/client'

import {
  AlertMessage,
  AsyncSearchInput,
  Box,
  Text,
} from '@island.is/island-ui/core'
import { Query, QueryPlateAvailableArgs } from '@island.is/web/graphql/schema'
import { PLATE_AVAILABLE_SEARCH_QUERY } from '@island.is/web/screens/queries/PublicVehicleSearch'

import { translation as translationStrings } from './translation.strings'
import * as styles from './PlateAvailableSearch.css'

const PLATE_NUMBER_REPLACEMENT_KEY = '{{USER_INPUT}}'

interface Props {
  text: string
  replacementKey: string
  replacementValue: string
}

const TextWithReplacedBoldValue = ({
  text,
  replacementKey,
  replacementValue,
}: Props) => {
  if (!text.includes(replacementKey)) return <Text>{text}</Text>

  const indexOfReplacementKey = text.indexOf(replacementKey)

  const prefix = text.slice(0, text.indexOf(replacementKey))
  const postfix = text.slice(indexOfReplacementKey + replacementKey.length)

  return (
    <Text>
      {prefix}
      <span className={styles.bold}>{replacementValue}</span>
      {postfix}
    </Text>
  )
}

const PlateAvailableSearch = () => {
  const { formatMessage } = useIntl()
  const [hasFocus, setHasFocus] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [shouldDisplayValidationError, setShouldDisplayValidationError] =
    useState(false)

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

  const aboveText = formatMessage(translationStrings.aboveText)

  return (
    <Box>
      {aboveText && (
        <Box marginBottom={2}>
          <Text>{aboveText}</Text>
        </Box>
      )}
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
            placeholder: formatMessage(translationStrings.inputPlaceholder),
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
          title={formatMessage(translationStrings.errorOccurredTitle)}
          message={formatMessage(translationStrings.errorOccurredMessage)}
        />
      )}
      {shouldDisplayValidationError && (
        <Text variant="small">
          <span className={styles.bold}>
            {formatMessage(translationStrings.attention)}{' '}
          </span>
          {formatMessage(translationStrings.regnoValidationText)}
        </Text>
      )}
      {!error &&
        !shouldDisplayValidationError &&
        data &&
        data.plateAvailable?.regno &&
        data.plateAvailable.available && (
          <TextWithReplacedBoldValue
            text={formatMessage(translationStrings.plateAvailableText, {
              PLATE_NUMBER: PLATE_NUMBER_REPLACEMENT_KEY,
            })}
            replacementKey={PLATE_NUMBER_REPLACEMENT_KEY}
            replacementValue={data.plateAvailable.regno}
          />
        )}
      {!error &&
        !shouldDisplayValidationError &&
        data &&
        data.plateAvailable?.regno &&
        !data.plateAvailable.available && (
          <TextWithReplacedBoldValue
            text={formatMessage(translationStrings.plateUnavailableText, {
              PLATE_NUMBER: PLATE_NUMBER_REPLACEMENT_KEY,
            })}
            replacementKey={PLATE_NUMBER_REPLACEMENT_KEY}
            replacementValue={data.plateAvailable.regno}
          />
        )}
    </Box>
  )
}

export default PlateAvailableSearch
