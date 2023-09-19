import { useLazyQuery } from '@apollo/client'
import { useState } from 'react'
import {
  AlertMessage,
  AsyncSearchInput,
  Box,
  Table,
  Text,
} from '@island.is/island-ui/core'
import { PUBLIC_SHIP_SEARCH_QUERY } from '@island.is/web/screens/queries/PublicShipSearch'
import {
  ConnectedComponent,
  GetPublicShipSearchQuery,
  GetPublicShipSearchQueryVariables,
  //   GetPublicShipSearchQuery,
  //   GetPublicShipSearchQueryVariables,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

const numberFormatter = new Intl.NumberFormat('de-DE')

const getValueOrEmptyString = (value?: string) => {
  return value ? value : ''
}

interface PublicShipSearchProps {
  slice: ConnectedComponent
}

const PublicShipSearch = ({ slice }: PublicShipSearchProps) => {
  const [hasFocus, setHasFocus] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const { format } = useDateUtils()

  const n = useNamespace(slice?.json ?? {})

  const [search, { loading, data, error, called }] = useLazyQuery<
    GetPublicShipSearchQuery,
    GetPublicShipSearchQueryVariables
  >(PUBLIC_SHIP_SEARCH_QUERY)

  const shipInformation = data?.shipRegistryShipSearch?.ships?.[0]

  const shipWasNotFound =
    shipInformation === null || typeof shipInformation === undefined

  const handleSearch = () => {
    if (!searchValue) {
      return
    }
    search({
      variables: {
        input: {
          qs: searchValue,
        },
      },
    })
  }

  //   const formattedRegistrationDate = shipInformation?.newRegDate
  //     ? format(new Date(shipInformation.newRegDate), 'do MMMM yyyy')
  //     : ''
  //   const formattedNextShipMainInspectionDate =
  //     shipInformation?.nextShipMainInspection
  //       ? format(
  //           new Date(shipInformation.nextShipMainInspection),
  //           'do MMMM yyyy',
  //         )
  //       : ''
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  //   const formattedShipType = formatShipType(shipInformation)

  return (
    <Box>
      <Text>{n('inputEyebrowText', 'Númer eða nafn skips:')}</Text>
      <Box marginTop={2} marginBottom={3}>
        <AsyncSearchInput
          buttonProps={{
            onClick: handleSearch,
            onFocus: () => setHasFocus(true),
            onBlur: () => setHasFocus(false),
          }}
          inputProps={{
            name: 'public-ship-search',
            inputSize: 'large',
            placeholder: n('inputPlaceholder', 'Leita í skipaskrá'),
            colored: true,
            onChange: (ev) => setSearchValue(ev.target.value.toUpperCase()),
            value: searchValue,
            onKeyDown: (ev) => {
              if (ev.key === 'Enter') {
                handleSearch()
              }
            },
          }}
          hasFocus={hasFocus}
          rootProps={{}}
          loading={loading}
        />
      </Box>
      {called && !loading && !error && shipWasNotFound && (
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
      {shipInformation && (
        <Box marginBottom={3} marginTop={4}>
          <Table.Table>
            <Table.Head>
              <Table.HeadData>
                <Text fontWeight="semiBold">
                  {n('shipInformationTableHeaderText', 'Niðurstaða leitar:')}
                </Text>
              </Table.HeadData>
              <Table.HeadData />
            </Table.Head>
            <Table.Body>
              {shipInformation.name && (
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">{n('shipName', 'Nafn:')}</Text>
                  </Table.Data>
                  <Table.Data>
                    <Text>{shipInformation.name}</Text>
                  </Table.Data>
                </Table.Row>
              )}
              {shipInformation.shipType && (
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">{n('shipType', 'Gerð:')}</Text>
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
                    <Text fontWeight="semiBold">{n('region', 'Umdæmi:')}</Text>
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
              {shipInformation.grossTonnage && (
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">
                      {n('grossTonnage', 'Brúttótonn:')}
                    </Text>
                  </Table.Data>
                  <Table.Data>
                    <Text>{shipInformation.grossTonnage}</Text>
                  </Table.Data>
                </Table.Row>
              )}
              {shipInformation.length && (
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">
                      {n('length', 'Skráð lengd:')}
                    </Text>
                  </Table.Data>
                  <Table.Data>
                    <Text>{shipInformation.length}</Text>
                  </Table.Data>
                </Table.Row>
              )}
              {/* {shipInformation.manufacturer && (
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">
                      {n('constructed', 'Smíðað:')}
                    </Text>
                  </Table.Data>
                  <Table.Data>
                    <Text>{shipInformation.manufacturer}</Text>
                  </Table.Data>
                </Table.Row>
              )} */}
              {/* {shipInformation.owners && (
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">
                      {n('owners', 'Eigendur:')}
                    </Text>
                  </Table.Data>
                  <Table.Data>
                    <Text>
                      <Text>{shipInformation.owners}</Text>
                    </Text>
                  </Table.Data>
                </Table.Row>
              )} */}
            </Table.Body>
          </Table.Table>
        </Box>
      )}
    </Box>
  )
}

export default PublicShipSearch
