import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useWindowSize } from 'react-use'
import { VehiclesPublicVehicleSearch } from '@island.is/api/schema'
import {
  AlertMessage,
  AsyncSearchInput,
  Box,
  Table,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatDate } from '@island.is/portals/my-pages/core'

import { vehicleMessage as messages } from '../../../lib/messages'
import { theme } from '@island.is/island-ui/theme'
import { usePublicVehicleSearchWithAuthLazyQuery } from '../Lookup.generated'

const numberFormatter = new Intl.NumberFormat('de-DE')

const getValueOrEmptyString = (value?: string | null) => {
  return value ? value : ''
}

const formatVehicleType = (
  vehicleInformation?: VehiclesPublicVehicleSearch | null,
) => {
  const make = getValueOrEmptyString(vehicleInformation?.make)
  const commercialName = getValueOrEmptyString(
    vehicleInformation?.vehicleCommercialName,
  )
  const hasName = Boolean(make || commercialName)
  if (!hasName) return ''
  const base = [make, commercialName].filter(Boolean).join(' - ')

  return `${base}${
    vehicleInformation?.color ? ' (' + vehicleInformation.color + ')' : ''
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

  const [search, { loading, data, error, called }] =
    usePublicVehicleSearchWithAuthLazyQuery()

  const vehicleInformation = data?.publicVehicleSearchWithAuth

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
            {formatMessage(messages.publicSearchTitle)}
          </Text>
          <Table.Table>
            <Table.Head>
              <Table.HeadData>
                <Text fontWeight="semiBold">
                  {[vehicleInformation.make, vehicleInformation.permno]
                    .filter(Boolean)
                    .join(' - ')}
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
              {vehicleInformation.co2 != null && (
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
              {vehicleInformation.weightedCo2 != null && (
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
              {vehicleInformation.co2WLTP != null && (
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
              {vehicleInformation.weightedCo2WLTP != null && (
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
