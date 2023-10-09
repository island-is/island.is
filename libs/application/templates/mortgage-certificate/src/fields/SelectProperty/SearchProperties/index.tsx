import React, { FC, useState } from 'react'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  Text,
  Input,
  Button,
  AlertMessage,
  ArrowLink,
} from '@island.is/island-ui/core'
import { PropertyTable } from './PropertyTable'
import { PropertyDetail } from '@island.is/api/schema'
import { gql, useLazyQuery } from '@apollo/client'
import { SEARCH_PROPERTIES_QUERY } from '../../../graphql/queries'
import { m } from '../../../lib/messages'
import { useLocale } from '@island.is/localization'

interface SearchPropertiesProps {
  selectHandler: (property: PropertyDetail | undefined) => void
  selectedPropertyNumber: string | undefined
}

export const searchPropertiesQuery = gql`
  ${SEARCH_PROPERTIES_QUERY}
`

export const SearchProperties: FC<
  React.PropsWithChildren<FieldBaseProps & SearchPropertiesProps>
> = ({ application, field, selectHandler, selectedPropertyNumber }) => {
  const { formatMessage } = useLocale()
  const { externalData } = application
  const [hasInitialized, setHasInitialized] = useState<boolean>(false)
  const [showSearchError, setShowSearchError] = useState<boolean>(false)
  const [searchStr, setSearchStr] = useState('')
  const [foundProperty, setFoundProperty] = useState<
    PropertyDetail | undefined
  >(undefined)

  const [runQuery, { loading }] = useLazyQuery(searchPropertiesQuery, {
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

  let selectProperty = getValueViaPath(
    application.answers,
    'selectProperty',
  ) as { propertyNumber: string; isFromSearch: boolean }

  const { propertyDetails, validation } =
    (externalData.validateMortgageCertificate?.data as {
      propertyDetails: PropertyDetail
      validation: {
        propertyNumber: string
        isFromSearch: boolean | undefined
      }
    }) || {}

  // check if validation data has a selected property
  if (!selectProperty?.propertyNumber) {
    if (validation?.propertyNumber) {
      selectProperty = {
        propertyNumber: validation.propertyNumber,
        isFromSearch: validation.isFromSearch || false,
      }
    }
  }

  // initialize search box and search result
  if (!hasInitialized && selectProperty?.isFromSearch) {
    setHasInitialized(true)

    if (
      selectProperty?.isFromSearch &&
      selectProperty?.propertyNumber === propertyDetails?.propertyNumber
    ) {
      setSearchStr(selectProperty?.propertyNumber || '')
      setFoundProperty(propertyDetails || undefined)
    }
  }

  return (
    <>
      <Box paddingY={4}>
        <Text paddingY={2} variant={'h4'}>
          {formatMessage(m.propertySearchInfoMessage)}
        </Text>

        <Box display="inlineBlock" marginLeft="smallGutter">
          <ArrowLink href="https://skra.is/default.aspx?pageid=d5db1b6d-0650-11e6-943c-005056851dd2">
            {formatMessage(m.propertySearchInfoLink)}
          </ArrowLink>
        </Box>
      </Box>

      <Box display="flex" flexDirection="row" paddingBottom={2}>
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
    </>
  )
}
