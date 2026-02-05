import { useEffect, useRef, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { useNavigate, useLocation } from 'react-router-dom'
import { useWindowSize } from 'react-use'

import {
  AlertMessage,
  AsyncSearchInput,
  Box,
  Table,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatDate } from '@island.is/portals/my-pages/core'

import { vehicleMessage as messages } from '../../lib/messages'
import { theme } from '@island.is/island-ui/theme'

type PublicVehicleSearchResult = {
  permno?: string | null
  regno?: string | null
  vin?: string | null
  make?: string | null
  vehicleCommercialName?: string | null
  color?: string | null
  firstRegDate?: string | null
  vehicleStatus?: string | null
  nextVehicleMainInspection?: string | null
  co2?: number | null
  weightedCo2?: number | null
  co2WLTP?: number | null
  weightedCo2WLTP?: number | null
  massLaden?: number | null
  mass?: number | null
}

type PublicVehicleSearchQuery = {
  getPublicVehicleSearch?: PublicVehicleSearchResult | null
}

type PublicVehicleSearchQueryVariables = {
  input: {
    search: string
  }
}

const PUBLIC_VEHICLE_SEARCH_QUERY = gql`
  query GetPublicVehicleSearch($input: GetPublicVehicleSearchInput!) {
    getPublicVehicleSearch(input: $input) {
      permno
      regno
      vin
      make
      vehicleCommercialName
      color
      firstRegDate
      vehicleStatus
      nextVehicleMainInspection
      co2
      weightedCo2
      co2WLTP
      weightedCo2WLTP
      massLaden
      mass
    }
  }
`

const numberFormatter = new Intl.NumberFormat('de-DE')

const getValueOrEmptyString = (value?: string | null) => {
  return value ? value : ''
}

const formatVehicleType = (
  vehicleInformation?: {
    vehicleCommercialName?: string | null
    color?: string | null
    make?: string | null
  } | null,
) => {
  const bothCommercialNameAndMakeArePresent =
    !!vehicleInformation?.make && !!vehicleInformation?.vehicleCommercialName
  if (!bothCommercialNameAndMakeArePresent) return ''

  return `${getValueOrEmptyString(vehicleInformation.make)}${
    bothCommercialNameAndMakeArePresent ? ' - ' : ''
  }${getValueOrEmptyString(vehicleInformation.vehicleCommercialName)}${
    vehicleInformation.color ? ' (' + vehicleInformation.color + ')' : ''
  }`
}

const useQueryParams = () => {
  const location = useLocation()
  return new URLSearchParams(location.search)
}

const PublicVehicleSearch = () => {
  const [hasFocus, setHasFocus] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const navigate = useNavigate()
  const queryParamInitialized = useRef(false)
  const query = useQueryParams()
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()
  const searchMaxWidth = width && width < theme.breakpoints.lg ? '100%' : '50%'

  const [search, { loading, data, error, called }] = useLazyQuery<
    PublicVehicleSearchQuery,
    PublicVehicleSearchQueryVariables
  >(PUBLIC_VEHICLE_SEARCH_QUERY)

  const vehicleInformation = data?.getPublicVehicleSearch

  const vehicleWasNotFound =
    vehicleInformation === null || typeof vehicleInformation === 'undefined'

  const handleSearch = (value: string) => {
    const updatedQuery = new URLSearchParams(query.toString())
    if (value) {
      updatedQuery.set('vq', value)

      search({
        variables: {
          input: {
            search: value,
          },
        },
      })
    }

    if (query.toString() !== updatedQuery.toString()) {
      navigate({
        search: `?${updatedQuery.toString()}`,
      })
    }
  }

  useEffect(() => {
    if (queryParamInitialized?.current) return
    queryParamInitialized.current = true
    const queryValue = query.get('vq')
    if (queryValue) {
      setSearchValue(queryValue)
      handleSearch(queryValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formattedRegistrationDate = vehicleInformation?.firstRegDate
    ? formatDate(vehicleInformation.firstRegDate)
    : ''
  const formattedNextVehicleMainInspectionDate =
    vehicleInformation?.nextVehicleMainInspection
      ? formatDate(vehicleInformation.nextVehicleMainInspection)
      : ''

  const formattedVehicleType = formatVehicleType(vehicleInformation)

  return (
    <Box>
      <Box marginTop={2} marginBottom={3} style={{ maxWidth: searchMaxWidth }}>
        <Text variant="eyebrow" color="blue400">
          {formatMessage(messages.searchLabel)}
        </Text>
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
            inputSize: 'semi-large',
            placeholder: formatMessage(messages.publicSearchInputPlaceholder),
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
            {formatMessage(messages.publicSearchNoVehicleFound)}
          </Text>
        </Box>
      )}
      {called && !loading && error && (
        <AlertMessage
          type="error"
          title={formatMessage(messages.publicSearchErrorTitle)}
          message={formatMessage(messages.publicSearchErrorMessage)}
        />
      )}
      {vehicleInformation && (
        <Box marginBottom={3} marginTop={4}>
          <Text variant="h5" paddingBottom={3}>
            Eftirfarandi upplýsingar fundust um ökutækið
          </Text>
          <Table.Table>
            <Table.Head>
              <Table.HeadData>
                <Text fontWeight="semiBold">
                  {`${vehicleInformation.make} - ${vehicleInformation.permno}`}
                </Text>
              </Table.HeadData>
              <Table.HeadData />
            </Table.Head>
            <Table.Body>
              {formattedVehicleType && (
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">
                      {formatMessage(messages.publicSearchVehicleType)}
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
                      {formatMessage(messages.publicSearchRegno)}
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
                      {formatMessage(messages.publicSearchPermno)}
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
                      {formatMessage(messages.publicSearchVin)}
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
                      {formatMessage(messages.publicSearchFirstRegDate)}
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
                      {formatMessage(messages.publicSearchCo2Nedc)}
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
                      {formatMessage(messages.publicSearchWeightedCo2Nedc)}
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
                      {formatMessage(messages.publicSearchCo2Wltp)}
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
                      {formatMessage(messages.publicSearchWeightedCo2Wltp)}
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
                      {formatMessage(messages.publicSearchMass)}
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
                      {formatMessage(messages.publicSearchMassLaden)}
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
                      {formatMessage(messages.publicSearchVehicleStatus)}
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
                      {formatMessage(messages.publicSearchNextInspection)}
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
