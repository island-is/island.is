import React, { FC, useState } from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import {
  Box,
  Text,
  Input,
  Button,
  AlertMessage,
} from '@island.is/island-ui/core'
import { PropertyTable } from './PropertyTable'
import { PropertyDetail } from '../../../types/schema'
import { gql, useLazyQuery } from '@apollo/client'
import { SEARCH_PROPERTIES_QUERY } from '../../../graphql/queries'
import { m } from '../../../lib/messages'
import { useLocale } from '@island.is/localization'

interface SearchPropertiesProps {
  selectHandler: (property: PropertyDetail | undefined) => void
  selectedPropertyNumber: string | undefined
}

export const searchPropertiesMutation = gql`
  ${SEARCH_PROPERTIES_QUERY}
`

export const SearchProperties: FC<FieldBaseProps & SearchPropertiesProps> = ({
  application,
  field,
  selectHandler,
  selectedPropertyNumber,
}) => {
  const { formatMessage } = useLocale()
  const [hasInitialized, setHasInitialized] = useState<boolean>(false)
  const [showSearchError, setShowSearchError] = useState<boolean>(false)
  const [searchStr, setSearchStr] = useState('')
  const [foundProperty, setFoundProperty] = useState<
    PropertyDetail | undefined
  >(undefined)

  const [runQuery, { loading }] = useLazyQuery(searchPropertiesMutation, {
    onCompleted(result) {
      setShowSearchError(false)
      setFoundProperty(result.searchForProperty)
    },
    onError() {
      setShowSearchError(true)
      setFoundProperty(undefined)
    },
  })

  const handleClickSearch = () => {
    runQuery({ variables: { input: { propertyNumber: searchStr } } })
  }

  const selectProperty = getValueViaPath(
    application.answers,
    'selectProperty',
  ) as { property: PropertyDetail; isFromSearch: boolean }

  // initialize search box and search result
  if (!hasInitialized && selectProperty?.isFromSearch) {
    setHasInitialized(true)
    setSearchStr(selectProperty?.property?.propertyNumber || '')
    setFoundProperty(selectProperty?.property || undefined)
  }

  return (
    <Box paddingY={2}>
      <Text paddingY={2} variant={'h4'}>
        Hér að neðan getur þú einnig leitað í fasteignanúmerum annarra eigna
      </Text>
      <Box display="flex" flexDirection="row">
        <Box width="full" marginRight={2}>
          <Input
            size="sm"
            label="Fasteignarnúmer"
            name="propertyNumber"
            value={searchStr}
            onChange={(e) => setSearchStr(e.target.value)}
          />
        </Box>
        <Box style={{ minWidth: 'fit-content' }}>
          <Button
            disabled={loading || !searchStr}
            onClick={() => handleClickSearch()}
            variant="ghost"
          >
            {formatMessage(m.propertySearch)}
          </Button>
        </Box>
      </Box>
      {!loading && foundProperty !== undefined && (
        <PropertyTable
          application={application}
          field={field}
          key={foundProperty.propertyNumber}
          selectHandler={selectHandler}
          propertyInfo={foundProperty}
          selectedPropertyNumber={selectedPropertyNumber}
        />
      )}

      <Box paddingTop={3} hidden={loading || !showSearchError}>
        <AlertMessage
          type="error"
          title={formatMessage(m.propertyNotFoundTitle)}
          message={formatMessage(m.propertyNotFoundMessage)}
        />
      </Box>
    </Box>
  )
}
