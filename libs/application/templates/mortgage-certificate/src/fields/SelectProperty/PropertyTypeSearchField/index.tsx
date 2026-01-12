import React, { FC, useEffect, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, LoadingDots, AlertMessage } from '@island.is/island-ui/core'
import { ManyPropertyDetail } from '@island.is/api/schema'
import { gql, useLazyQuery } from '@apollo/client'
import { SEARCH_ALL_PROPERTIES_QUERY } from '../../../graphql/queries'
import { useLocale } from '@island.is/localization'
import { propertySearch } from '../../../lib/messages'
import debounce from 'lodash/debounce'
import { InputController } from '@island.is/shared/form-fields'
import { PropertyTypes } from '../../../lib/constants'
import { PropertyTable } from './PropertyTable'
import { FieldArrayWithId } from 'react-hook-form'
import { MortgageCertificate } from '../../../lib/dataSchema'
import { getValueViaPath } from '@island.is/application/core'
import { SelectedProperty } from '../../../shared'

interface SearchPropertiesProps {
  propertyType: PropertyTypes | undefined
  checkedProperties: FieldArrayWithId<
    MortgageCertificate,
    'selectedProperties.properties',
    'id'
  >[]
  setCheckedProperties: (property: SelectedProperty, index: number) => void
}

export const searchPropertiesQuery = gql`
  ${SEARCH_ALL_PROPERTIES_QUERY}
`

export const PropertyTypeSearchField: FC<
  React.PropsWithChildren<FieldBaseProps & SearchPropertiesProps>
> = ({
  application,
  field,
  checkedProperties,
  setCheckedProperties,
  propertyType,
}) => {
  const { formatMessage } = useLocale()
  const [showSearchError, setShowSearchError] = useState<boolean>(false)
  const [showApiError, setShowApiError] = useState<boolean>(false)
  const [searchStr, setSearchStr] = useState(
    getValueViaPath(application.answers, `${field.id}.searchStr`, '') as string,
  )
  const [foundProperties, setFoundProperties] = useState<
    ManyPropertyDetail | undefined
  >()

  const [runQuery, { loading }] = useLazyQuery(searchPropertiesQuery, {
    onCompleted(result) {
      const resProperty = result.searchForAllProperties as
        | ManyPropertyDetail
        | undefined
      setFoundProperties(resProperty)
      if (resProperty?.propertyNumber) {
        setShowSearchError(false)
        setShowApiError(false)
      } else {
        setShowSearchError(true)
        setShowApiError(false)
      }
    },
    onError() {
      setShowSearchError(false)
      setShowApiError(true)
      setFoundProperties(undefined)
    },
  })

  useEffect(() => {
    if (searchStr.length) {
      setShowSearchError(false)
      setShowApiError(false)
      runQuery({
        variables: {
          input: {
            propertyNumber: searchStr,
            propertyType: propertyType?.toString(),
          },
        },
      })
    }
  }, [searchStr, runQuery])

  return (
    <Box paddingTop={2}>
      <InputController
        backgroundColor="blue"
        label={formatMessage(propertySearch.labels.searchLabel)}
        placeholder={formatMessage(propertySearch.labels.searchPlaceholder)}
        id={`${field.id}.searchStr`}
        name={`${field.id}.searchStr`}
        onChange={debounce((e) => setSearchStr(e.target.value), 300)}
        icon="search"
        inputMode="search"
        disabled={propertyType === undefined}
      />
      {loading && (
        <Box display="flex" justifyContent="center" paddingTop={4}>
          <LoadingDots size="large" />
        </Box>
      )}
      {!loading && foundProperties && (
        <PropertyTable
          application={application}
          field={field}
          propertyInfo={foundProperties}
          checkedProperties={checkedProperties}
          selectHandler={(p: SelectedProperty, index: number) =>
            setCheckedProperties(p, index)
          }
        />
      )}

      <Box paddingTop={3} hidden={loading || !showSearchError}>
        <AlertMessage
          type="warning"
          message={formatMessage(propertySearch.labels.propertyNotFound)}
        />
      </Box>

      <Box paddingTop={3} hidden={loading || !showApiError}>
        <AlertMessage
          type="warning"
          message={formatMessage(propertySearch.labels.propertyApiError)}
        />
      </Box>
    </Box>
  )
}
