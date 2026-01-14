import React, { useState, useEffect, FC } from 'react'
import {
  Box,
  LoadingDots,
  AlertMessage,
  ErrorMessage,
} from '@island.is/island-ui/core'
import {
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import { gql, useLazyQuery } from '@apollo/client'
import debounce from 'lodash/debounce'
import { useLocale } from '@island.is/localization'
import { GET_PROPERTIES_BY_PROPERTY_CODE_QUERY } from '../../graphql/queries'
import { FieldBaseProps } from '@island.is/application/types'
import { Fasteign } from '@island.is/clients/assets'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'
import { realEstateMessages } from '../../lib/messages'

export const searchPropertiesQuery = gql`
  ${GET_PROPERTIES_BY_PROPERTY_CODE_QUERY}
`

export const RealEstateSearch: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { setBeforeSubmitCallback, application, errors } = props
  const { formatMessage } = useLocale()
  const [searchStr, setSearchStr] = useState('')
  const { getValues, setValue } = useFormContext()
  const [showSearchError, setShowSearchError] = useState(false)
  const [showApiError, setShowApiError] = useState(false)
  const [realEstates, setRealEstates] = useState<Array<Fasteign>>([])

  const [runQuery, { loading }] = useLazyQuery(searchPropertiesQuery, {
    onCompleted(result) {
      const resProperty = result.searchForAllProperties as Array<Fasteign>
      if (resProperty.length > 0) {
        setShowSearchError(false)
        setShowApiError(false)
      } else {
        setShowSearchError(true)
        setShowApiError(false)
      }

      setRealEstates(resProperty)
    },
    onError() {
      setShowSearchError(false)
      setShowApiError(true)
    },
  })

  useEffect(() => {
    const searchStrVal = getValues('realEstateSearch')
    setValue('realEstate.realEstateName', '')
    if (searchStrVal) setSearchStr(searchStrVal)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setShowApiError(false)
    setShowSearchError(false)

    if (searchStr.length) {
      if (isRunningOnEnvironment('local') || isRunningOnEnvironment('dev')) {
        const mockData = getValueViaPath<Array<Fasteign>>(
          application.externalData,
          'getProperties.data',
        )
        setRealEstates(mockData || [])
        return
      }
      setShowSearchError(false)
      setShowApiError(false)
      runQuery({
        variables: { input: { fasteignNrs: [searchStr] } },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchStr, runQuery])

  setBeforeSubmitCallback?.(async () => {
    const realEstateNumber = getValues('realEstate.realEstateName')
    const found = realEstates.find(
      (property) => property.fasteignanumer === realEstateNumber,
    )

    if (found) {
      setValue('realEstateExtra', found)
      return [true, null]
      // set the value so it can be accessed in answers later in the application and during submit.
    }

    return [true, null]
  })

  return (
    <Box paddingTop={2}>
      <Box paddingBottom={2}>
        <InputController
          backgroundColor="blue"
          label={formatMessage(realEstateMessages.realEstateNumber)}
          placeholder={formatMessage(
            realEstateMessages.realEstateSearchPlaceholder,
          )}
          id="realEstateSearch"
          name="realEstateSearch"
          onChange={debounce((e) => setSearchStr(e.target.value), 300)}
          icon="search"
          inputMode="search"
        />
      </Box>
      {loading && (
        <Box display="flex" justifyContent="center" paddingTop={4}>
          <LoadingDots size="large" />
        </Box>
      )}
      <SelectController
        label={formatMessage(realEstateMessages.realEstateLabel)}
        disabled={realEstates.length < 1}
        id={'realEstate.realEstateName'}
        name={'realEstate.realEstateName'}
        options={
          realEstates.map((property) => ({
            value: property.fasteignanumer || '',
            label: `(${property.fasteignanumer}) ${property?.sjalfgefidStadfang?.birting}`,
          })) || []
        }
      />
      {errors && getErrorViaPath(errors, 'realEstate.realEstateName') && (
        <Box paddingTop={3}>
          <ErrorMessage>
            {formatMessage(realEstateMessages.realEstateSelectError)}
          </ErrorMessage>
        </Box>
      )}
      <Box paddingTop={3} hidden={loading || !showSearchError}>
        <AlertMessage
          type="warning"
          message={formatMessage(realEstateMessages.realEstateSearchNotFound)}
        />
      </Box>
      <Box paddingTop={3} hidden={loading || !showApiError}>
        <AlertMessage
          type="warning"
          message={formatMessage(realEstateMessages.realEstateSearchApiError)}
        />
      </Box>
    </Box>
  )
}
