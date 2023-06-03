import { useLazyQuery } from '@apollo/client'
import { useState } from 'react'
import {
  Box,
  Button,
  Inline,
  Input,
  Stack,
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

interface PublicVehicleSearchProps {
  slice: ConnectedComponent
}

const PublicVehicleSearch = ({ slice }: PublicVehicleSearchProps) => {
  const [searchValue, setSearchValue] = useState('')
  const { format } = useDateUtils()

  const n = useNamespace(slice.configJson ?? {})

  const [search, { loading, data, error, called }] = useLazyQuery<
    GetPublicVehicleSearchQuery,
    GetPublicVehicleSearchQueryVariables
  >(PUBLIC_VEHICLE_SEARCH_QUERY)

  const vehicleInformation = data?.getPublicVehicleSearch

  const vehicleWasNotFound =
    vehicleInformation === null || typeof vehicleInformation === undefined

  return (
    <Box>
      <Input
        name="vehicle-search"
        onChange={(ev) => setSearchValue(ev.target.value.toUpperCase())}
      />
      <Button
        loading={loading}
        onClick={() => {
          search({
            variables: {
              input: {
                search: searchValue,
              },
            },
          })
        }}
      >
        Leita
      </Button>
      {called && !loading && !error && vehicleWasNotFound && (
        <Box>
          <Text>Ekkert ökutæki fannst</Text>
        </Box>
      )}
      {vehicleInformation && (
        <Box>
          <Stack space={2}>
            <Text>Eftirfarandi upplýsingar fundust um ökutækið</Text>
            <Inline space={2}>
              <Text fontWeight="semiBold">{n('permno', 'Fastanúmer')}</Text>
              <Text>{vehicleInformation.permno}</Text>
            </Inline>
            <Inline space={2}>
              <Text fontWeight="semiBold">{n('regno', 'Skráningarnúmer')}</Text>
              <Text>{vehicleInformation.regno}</Text>
            </Inline>
            <Inline space={2}>
              <Text fontWeight="semiBold">
                {n('vehicleStatus', 'Skoðunarstaða ökutækis')}
              </Text>
              <Text>{vehicleInformation.vehicleStatus}</Text>
            </Inline>
            {vehicleInformation.nextVehicleMainInspection && (
              <Inline space={2}>
                <Text fontWeight="semiBold">
                  {n('nextVehicleMainInspection', 'Næsta aðalskoðun')}
                </Text>
                <Text>
                  {format(
                    new Date(vehicleInformation.nextVehicleMainInspection),
                    'do MMMM yyyy',
                  )}
                </Text>
              </Inline>
            )}
            <Inline space={2}>
              <Text fontWeight="semiBold">{n('co2', 'Co2')}</Text>
              <Text>{vehicleInformation.co2}</Text>
            </Inline>
            <Inline space={2}>
              <Text fontWeight="semiBold">
                {n('vehicleCommercialName', 'Tegund')}
              </Text>
              <Text>{vehicleInformation.vehicleCommercialName}</Text>
            </Inline>
            {vehicleInformation.newRegDate && (
              <Inline space={2}>
                <Text fontWeight="semiBold">
                  {n('newRegDate', 'Fyrst skráð')}
                </Text>
                <Text>
                  {format(
                    new Date(vehicleInformation.newRegDate),
                    'do MMMM yyyy',
                  )}
                </Text>
              </Inline>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  )
}

export default PublicVehicleSearch
