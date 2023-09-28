import { useLazyQuery } from '@apollo/client'
import { useEffect, useRef, useState } from 'react'
import isEqual from 'lodash/isEqual'
import { useRouter } from 'next/router'
import {
  AlertMessage,
  AsyncSearchInput,
  Box,
  Table,
  Text,
} from '@island.is/island-ui/core'
import { PUBLIC_VEHICLE_SEARCH_QUERY } from '@island.is/web/screens/queries/PublicVehicleSearch'
import {
  ConnectedComponent,
  GetPublicVehicleSearchQuery,
  GetPublicVehicleSearchQueryVariables,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

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

interface PublicVehicleSearchProps {
  slice: ConnectedComponent
}

const PublicVehicleSearch = ({ slice }: PublicVehicleSearchProps) => {
  const [hasFocus, setHasFocus] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const { format } = useDateUtils()
  const router = useRouter()
  const queryParamInitialized = useRef(false)

  const n = useNamespace(slice?.json ?? {})

  const [search, { loading, data, error, called }] = useLazyQuery<
    GetPublicVehicleSearchQuery,
    GetPublicVehicleSearchQueryVariables
  >(PUBLIC_VEHICLE_SEARCH_QUERY)

  const vehicleInformation = data?.getPublicVehicleSearch

  const vehicleWasNotFound =
    vehicleInformation === null || typeof vehicleInformation === undefined

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

  const formattedRegistrationDate = vehicleInformation?.newRegDate
    ? format(new Date(vehicleInformation.newRegDate), 'do MMMM yyyy')
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
      <Text>
        {n(
          'inputEyebrowText',
          'Skráningarnúmer, fastanúmer eða verksmiðjunúmer:',
        )}
      </Text>
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
            placeholder: n('inputPlaceholder', 'Leita í ökutækjaskrá'),
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
            {n('noVehicleFound', 'Ekkert ökutæki fannst')}
          </Text>
        </Box>
      )}
      {called && !loading && error && (
        <AlertMessage
          type="error"
          title={n('errorOccurredTitle', 'Villa kom upp')}
          message={n('errorOccurredMessage', 'Ekki tókst að sækja ökutæki')}
        />
      )}
      {vehicleInformation && (
        <Box marginBottom={3} marginTop={4}>
          <Table.Table>
            <Table.Head>
              <Table.HeadData>
                <Text fontWeight="semiBold">
                  {n('vehicleInformationTableHeaderText', 'Niðurstaða leitar:')}
                </Text>
              </Table.HeadData>
              <Table.HeadData />
            </Table.Head>
            <Table.Body>
              {formattedVehicleType && (
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">
                      {n('vehicleCommercialName', 'Tegund:')}
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
                      {n('regno', 'Skráningarnúmer:')}
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
                      {n('permno', 'Fastanúmer:')}
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
                      {n('vin', 'Verksmiðjunúmer:')}
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
                      {n('newRegDate', 'Fyrst skráð:')}
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
                      {n('co2NEDC', 'CO2-gildi (NEDC):')}
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
                      {n('weightedCo2NEDC', 'Vegið CO2-gildi (NEDC):')}
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
                      {n('Co2WLTP', 'CO2-gildi (WLTP):')}
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
                      {n('weightedCo2WLTP', 'Vegið CO2-gildi (WLTP):')}
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
                      {n('mass', 'Eigin þyngd:')}
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
                      {n('massLaden', 'Leyfð heildarþyngd:')}
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
                      {n('vehicleStatus', 'Staða:')}
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
                      {n('nextVehicleMainInspection', 'Næsta skoðun:')}
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
      <Box marginTop={2}>
        <Text variant="small">
          {n(
            'moreInfoText',
            'Hægt er að fletta upp bílnúmerum á Mínum síðum og fá þar ítarlegri upplýsingar',
          )}
        </Text>
      </Box>
    </Box>
  )
}

export default PublicVehicleSearch
