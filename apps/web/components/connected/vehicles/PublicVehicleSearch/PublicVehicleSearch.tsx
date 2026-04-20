import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import isEqual from 'lodash/isEqual'
import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/client'

import {
  AlertMessage,
  AsyncSearchInput,
  Box,
  Table,
  Text,
} from '@island.is/island-ui/core'
import {
  PublicVehicleSearchQuery,
  PublicVehicleSearchQueryVariables,
} from '@island.is/web/graphql/schema'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { PUBLIC_VEHICLE_SEARCH_QUERY } from '@island.is/web/screens/queries/PublicVehicleSearch'

import { translation as translationStrings } from './translation.strings'

const numberFormatter = new Intl.NumberFormat('de-DE')

const getValueOrEmptyString = (value?: string) => {
  return value ? value : ''
}

const formatVehicleType = (vehicleInformation?: {
  vehicleCommercialName?: string
  color?: string
  make?: string
}) => {
  const bothCommercialNameAndMakeArePresent =
    !!vehicleInformation?.make && !!vehicleInformation?.vehicleCommercialName
  if (!bothCommercialNameAndMakeArePresent) return ''

  return `${getValueOrEmptyString(vehicleInformation.make)}${
    bothCommercialNameAndMakeArePresent ? ' - ' : ''
  }${getValueOrEmptyString(vehicleInformation.vehicleCommercialName)}${
    vehicleInformation.color ? ' (' + vehicleInformation.color + ')' : ''
  }`
}

const PublicVehicleSearch = () => {
  const [hasFocus, setHasFocus] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const { format } = useDateUtils()
  const router = useRouter()
  const queryParamInitialized = useRef(false)

  const { formatMessage } = useIntl()

  const [search, { loading, data, error, called }] = useLazyQuery<
    PublicVehicleSearchQuery,
    PublicVehicleSearchQueryVariables
  >(PUBLIC_VEHICLE_SEARCH_QUERY)

  const vehicleInformation = data?.publicVehicleSearch

  const vehicleWasNotFound =
    vehicleInformation === null || typeof vehicleInformation === 'undefined'

  const handleSearch = (value: string) => {
    const updatedQuery = { ...router.query }
    if (value) {
      updatedQuery['vq'] = value

      search({
        variables: {
          input: {
            search: value,
          },
        },
      })
    }

    if (!isEqual(router.query, updatedQuery)) {
      router.replace(
        {
          pathname: router.pathname,
          query: updatedQuery,
        },
        undefined,
        {
          shallow: true,
        },
      )
    }
  }

  useEffect(() => {
    if (!router?.isReady || queryParamInitialized?.current) return
    queryParamInitialized.current = true
    if (router.query.vq) {
      setSearchValue(router.query.vq as string)
      handleSearch(router.query.vq as string)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.isReady, router?.query?.vq])

  const formattedRegistrationDate = vehicleInformation?.firstRegDate
    ? format(new Date(vehicleInformation.firstRegDate), 'do MMMM yyyy')
    : ''
  const formattedNextVehicleMainInspectionDate =
    vehicleInformation?.nextVehicleMainInspection
      ? format(
          new Date(vehicleInformation.nextVehicleMainInspection),
          'do MMMM yyyy',
        )
      : ''
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const formattedVehicleType = formatVehicleType(vehicleInformation)

  return (
    <Box>
      <Box marginTop={2} marginBottom={3}>
        <AsyncSearchInput
          buttonProps={{
            onClick: () => {
              handleSearch(searchValue)
            },
            onFocus: () => setHasFocus(true),
            onBlur: () => setHasFocus(false),
          }}
          inputProps={{
            name: 'public-vehicle-search',
            inputSize: 'large',
            placeholder: formatMessage(translationStrings.inputPlaceholder),
            colored: true,
            onChange: (ev) => setSearchValue(ev.target.value.toUpperCase()),
            value: searchValue,
            onKeyDown: (ev) => {
              if (ev.key === 'Enter') {
                handleSearch(searchValue)
              }
            },
          }}
          hasFocus={hasFocus}
          rootProps={{}}
          loading={loading}
        />
      </Box>
      {called && !loading && !error && vehicleWasNotFound && (
        <Box>
          <Text fontWeight="semiBold">
            {formatMessage(translationStrings.noVehicleFound)}
          </Text>
        </Box>
      )}
      {called && !loading && error && (
        <AlertMessage
          type="error"
          title={formatMessage(translationStrings.errorOccurredTitle)}
          message={formatMessage(translationStrings.errorOccurredMessage)}
        />
      )}
      {vehicleInformation && (
        <Box marginBottom={3} marginTop={4}>
          <Table.Table>
            <Table.Head>
              <Table.HeadData>
                <Text fontWeight="semiBold">
                  {formatMessage(
                    translationStrings.vehicleInformationTableHeaderText,
                  )}
                </Text>
              </Table.HeadData>
              <Table.HeadData />
            </Table.Head>
            <Table.Body>
              {formattedVehicleType && (
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">
                      {formatMessage(translationStrings.vehicleCommercialName)}
                    </Text>
                  </Table.Data>
                  <Table.Data>
                    <Text>{formattedVehicleType}</Text>
                  </Table.Data>
                </Table.Row>
              )}
              {vehicleInformation.regno && (
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">
                      {formatMessage(translationStrings.regno)}
                    </Text>
                  </Table.Data>
                  <Table.Data>
                    <Text>{vehicleInformation.regno}</Text>
                  </Table.Data>
                </Table.Row>
              )}
              {vehicleInformation.permno && (
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">
                      {formatMessage(translationStrings.permno)}
                    </Text>
                  </Table.Data>
                  <Table.Data>
                    <Text>{vehicleInformation.permno}</Text>
                  </Table.Data>
                </Table.Row>
              )}
              {vehicleInformation.vin && (
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">
                      {formatMessage(translationStrings.vin)}
                    </Text>
                  </Table.Data>
                  <Table.Data>
                    <Text>{vehicleInformation.vin}</Text>
                  </Table.Data>
                </Table.Row>
              )}
              {formattedRegistrationDate && (
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">
                      {formatMessage(translationStrings.firstRegDate)}
                    </Text>
                  </Table.Data>
                  <Table.Data>
                    <Text>{formattedRegistrationDate}</Text>
                  </Table.Data>
                </Table.Row>
              )}
              {vehicleInformation.co2 && (
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">
                      {formatMessage(translationStrings.co2NEDC)}
                    </Text>
                  </Table.Data>
                  <Table.Data>
                    <Text>{vehicleInformation.co2}</Text>
                  </Table.Data>
                </Table.Row>
              )}
              {vehicleInformation.weightedCo2 && (
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">
                      {formatMessage(translationStrings.weightedCo2NEDC)}
                    </Text>
                  </Table.Data>
                  <Table.Data>
                    <Text>{vehicleInformation.weightedCo2}</Text>
                  </Table.Data>
                </Table.Row>
              )}
              {vehicleInformation.co2WLTP && (
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">
                      {formatMessage(translationStrings.Co2WLTP)}
                    </Text>
                  </Table.Data>
                  <Table.Data>
                    <Text>{vehicleInformation.co2WLTP}</Text>
                  </Table.Data>
                </Table.Row>
              )}
              {vehicleInformation.weightedCo2WLTP && (
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">
                      {formatMessage(translationStrings.weightedCo2WLTP)}
                    </Text>
                  </Table.Data>
                  <Table.Data>
                    <Text>{vehicleInformation.weightedCo2WLTP}</Text>
                  </Table.Data>
                </Table.Row>
              )}
              {vehicleInformation.mass && (
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">
                      {formatMessage(translationStrings.mass)}
                    </Text>
                  </Table.Data>
                  <Table.Data>
                    <Text>
                      {numberFormatter.format(vehicleInformation.mass)} kg
                    </Text>
                  </Table.Data>
                </Table.Row>
              )}
              {vehicleInformation.massLaden && (
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">
                      {formatMessage(translationStrings.massLaden)}
                    </Text>
                  </Table.Data>
                  <Table.Data>
                    <Text>
                      {numberFormatter.format(vehicleInformation.massLaden)} kg
                    </Text>
                  </Table.Data>
                </Table.Row>
              )}
              {vehicleInformation.vehicleStatus && (
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">
                      {formatMessage(translationStrings.vehicleStatus)}
                    </Text>
                  </Table.Data>
                  <Table.Data>
                    <Text>{vehicleInformation.vehicleStatus}</Text>
                  </Table.Data>
                </Table.Row>
              )}
              {formattedNextVehicleMainInspectionDate && (
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">
                      {formatMessage(
                        translationStrings.nextVehicleMainInspection,
                      )}
                    </Text>
                  </Table.Data>
                  <Table.Data>
                    <Text>{formattedNextVehicleMainInspectionDate}</Text>
                  </Table.Data>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Table>
        </Box>
      )}
    </Box>
  )
}

export default PublicVehicleSearch
