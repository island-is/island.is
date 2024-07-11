import { useLazyQuery } from '@apollo/client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import isEqual from 'lodash/isEqual'
import {
  AlertMessage,
  AsyncSearchInput,
  Box,
  Stack,
  Table,
  Text,
} from '@island.is/island-ui/core'
import { PUBLIC_SHIP_SEARCH_QUERY } from '@island.is/web/screens/queries/PublicShipSearch'
import {
  ConnectedComponent,
  GetPublicShipSearchQuery,
  GetPublicShipSearchQueryVariables,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'

const numberFormatter = new Intl.NumberFormat('de-DE')

interface PublicShipSearchProps {
  slice: ConnectedComponent
}

const PublicShipSearch = ({ slice }: PublicShipSearchProps) => {
  const [hasFocus, setHasFocus] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const router = useRouter()
  const queryParamInitialized = useRef(false)

  const [ships, setShips] = useState<
    GetPublicShipSearchQuery['shipRegistryShipSearch']['ships']
  >([])

  const n = useNamespace(slice?.json ?? {})

  const [search, { loading, error, called }] = useLazyQuery<
    GetPublicShipSearchQuery,
    GetPublicShipSearchQueryVariables
  >(PUBLIC_SHIP_SEARCH_QUERY, {
    onCompleted(data) {
      setShips(data?.shipRegistryShipSearch?.ships ?? [])
    },
  })

  const noShipWasFound = !ships?.length

  const handleSearch = (value: string) => {
    const updatedQuery = { ...router.query }
    if (value) {
      updatedQuery['sq'] = value

      search({
        variables: {
          input: {
            qs: value,
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
    if (router.query.sq) {
      setSearchValue(router.query.sq as string)
      handleSearch(router.query.sq as string)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.isReady, router?.query?.sq])

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
            name: 'public-ship-search',
            inputSize: 'large',
            placeholder: n('inputPlaceholder', 'Númer eða nafn skips'),
            colored: true,
            onChange: (ev) => setSearchValue(ev.target.value),
            value: searchValue,
            onKeyDown: (ev) => {
              if (ev.key === 'Enter') {
                handleSearch(searchValue)
              }
            },
          }}
          hasFocus={hasFocus}
          loading={loading}
        />
      </Box>
      {called && !loading && !error && noShipWasFound && (
        <Box>
          <Text fontWeight="semiBold">
            {n('noShipFound', 'Ekkert skip fannst')}
          </Text>
        </Box>
      )}
      {called && !loading && error && (
        <AlertMessage
          type="error"
          title={n('errorOccurredTitle', 'Villa kom upp')}
          message={n('errorOccurredMessage', 'Ekki tókst að sækja skip')}
        />
      )}
      <Box marginBottom={3} marginTop={4}>
        <Stack space={10}>
          {ships.map((shipInformation, index) => (
            <Table.Table key={index}>
              {index === 0 && (
                <Table.Head>
                  <Table.HeadData>
                    <Text fontWeight="semiBold">
                      {n(
                        'shipInformationTableHeaderText',
                        'Niðurstaða leitar:',
                      )}
                    </Text>
                  </Table.HeadData>
                  <Table.HeadData />
                </Table.Head>
              )}
              <Table.Body>
                {shipInformation.shipName && (
                  <Table.Row>
                    <Table.Data>
                      <Text fontWeight="semiBold">
                        {n('shipName', 'Nafn:')}
                      </Text>
                    </Table.Data>
                    <Table.Data>
                      <Text>{shipInformation.shipName}</Text>
                    </Table.Data>
                  </Table.Row>
                )}
                {shipInformation.shipType && (
                  <Table.Row>
                    <Table.Data>
                      <Text fontWeight="semiBold">
                        {n('shipType', 'Gerð:')}
                      </Text>
                    </Table.Data>
                    <Table.Data>
                      <Text>{shipInformation.shipType}</Text>
                    </Table.Data>
                  </Table.Row>
                )}
                {shipInformation.regno && (
                  <Table.Row>
                    <Table.Data>
                      <Text fontWeight="semiBold">
                        {n('regno', 'Skráningarnúmer:')}
                      </Text>
                    </Table.Data>
                    <Table.Data>
                      <Text>{shipInformation.regno}</Text>
                    </Table.Data>
                  </Table.Row>
                )}
                {shipInformation.region && (
                  <Table.Row>
                    <Table.Data>
                      <Text fontWeight="semiBold">
                        {n('region', 'Umdæmi:')}
                      </Text>
                    </Table.Data>
                    <Table.Data>
                      <Text>{shipInformation.region}</Text>
                    </Table.Data>
                  </Table.Row>
                )}
                {shipInformation.portOfRegistry && (
                  <Table.Row>
                    <Table.Data>
                      <Text fontWeight="semiBold">
                        {n('portOfRegistry', 'Heimahöfn:')}
                      </Text>
                    </Table.Data>
                    <Table.Data>
                      <Text>{shipInformation.portOfRegistry}</Text>
                    </Table.Data>
                  </Table.Row>
                )}
                {shipInformation.regStatus && (
                  <Table.Row>
                    <Table.Data>
                      <Text fontWeight="semiBold">
                        {n('regStatus', 'Skráningar staða:')}
                      </Text>
                    </Table.Data>
                    <Table.Data>
                      <Text>{shipInformation.regStatus}</Text>
                    </Table.Data>
                  </Table.Row>
                )}
                {typeof shipInformation.grossTonnage === 'number' && (
                  <Table.Row>
                    <Table.Data>
                      <Text fontWeight="semiBold">
                        {n('grossTonnage', 'Brúttótonn:')}{' '}
                      </Text>
                    </Table.Data>
                    <Table.Data>
                      <Text>
                        {numberFormatter.format(shipInformation.grossTonnage)}{' '}
                        {n('grossTonnageMeasurement', 't')}
                      </Text>
                    </Table.Data>
                  </Table.Row>
                )}
                {typeof shipInformation.length === 'number' && (
                  <Table.Row>
                    <Table.Data>
                      <Text fontWeight="semiBold">
                        {n('length', 'Skráð lengd:')}
                      </Text>
                    </Table.Data>
                    <Table.Data>
                      <Text>
                        {numberFormatter.format(shipInformation.length)}{' '}
                        {n('lengthMeasurement', 'm')}
                      </Text>
                    </Table.Data>
                  </Table.Row>
                )}
                {(shipInformation.manufacturer ||
                  typeof shipInformation.manufactionYear === 'number') && (
                  <Table.Row>
                    <Table.Data>
                      <Text fontWeight="semiBold">
                        {n('constructed', 'Smíðað:')}
                      </Text>
                    </Table.Data>
                    <Table.Data>
                      <Text>
                        {shipInformation.manufactionYear}{' '}
                        {shipInformation.manufacturer &&
                          n('manufacturedBy', 'af')}{' '}
                        {shipInformation.manufacturer}
                      </Text>
                    </Table.Data>
                  </Table.Row>
                )}
                {typeof shipInformation.owners?.length === 'number' &&
                  shipInformation.owners.length > 0 && (
                    <Table.Row>
                      <Table.Data>
                        <Text fontWeight="semiBold">
                          {n('owners', 'Eigendur:')}
                        </Text>
                      </Table.Data>
                      <Table.Data>
                        <Stack space={2}>
                          {shipInformation.owners?.map((owner) => (
                            <Box>
                              <Text>
                                {owner?.name}{' '}
                                {owner?.nationalId
                                  ? `${n('nationalIdPrefix', 'kt.')} ${
                                      owner.nationalId
                                    }`
                                  : ''}
                              </Text>
                              <Text>
                                {typeof owner?.sharePercentage === 'number'
                                  ? `${owner.sharePercentage}% ${n(
                                      'sharePercentageProperty',
                                      'eign',
                                    )}`
                                  : ''}
                              </Text>
                            </Box>
                          ))}
                        </Stack>
                      </Table.Data>
                    </Table.Row>
                  )}
              </Table.Body>
            </Table.Table>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

export default PublicShipSearch
