import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import isEqual from 'lodash/isEqual'
import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/client'

import {
  AlertMessage,
  AsyncSearchInput,
  Box,
  Stack,
  Table,
  Text,
} from '@island.is/island-ui/core'
import {
  GetPublicShipSearchQuery,
  GetPublicShipSearchQueryVariables,
} from '@island.is/web/graphql/schema'
import { PUBLIC_SHIP_SEARCH_QUERY } from '@island.is/web/screens/queries/PublicShipSearch'

import { translation as translationStrings } from './translation.strings'

const numberFormatter = new Intl.NumberFormat('de-DE')

const PublicShipSearch = () => {
  const [hasFocus, setHasFocus] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const router = useRouter()
  const queryParamInitialized = useRef(false)

  const [ships, setShips] = useState<
    GetPublicShipSearchQuery['shipRegistryShipSearch']['ships']
  >([])

  const { formatMessage } = useIntl()

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
            placeholder: formatMessage(translationStrings.inputPlaceholder),
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
            {formatMessage(translationStrings.noShipFound)}
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
      <Box marginBottom={3} marginTop={4}>
        <Stack space={10}>
          {ships.map((shipInformation, index) => (
            <Table.Table key={index}>
              {index === 0 && (
                <Table.Head>
                  <Table.HeadData>
                    <Text fontWeight="semiBold">
                      {formatMessage(
                        translationStrings.shipInformationTableHeaderText,
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
                        {formatMessage(translationStrings.shipName)}
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
                        {formatMessage(translationStrings.shipType)}
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
                        {formatMessage(translationStrings.regno)}
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
                        {formatMessage(translationStrings.region)}
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
                        {formatMessage(translationStrings.portOfRegistry)}
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
                        {formatMessage(translationStrings.regStatus)}
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
                        {formatMessage(translationStrings.grossTonnage)}{' '}
                      </Text>
                    </Table.Data>
                    <Table.Data>
                      <Text>
                        {numberFormatter.format(shipInformation.grossTonnage)}{' '}
                        {formatMessage(
                          translationStrings.grossTonnageMeasurement,
                        )}
                      </Text>
                    </Table.Data>
                  </Table.Row>
                )}
                {typeof shipInformation.length === 'number' && (
                  <Table.Row>
                    <Table.Data>
                      <Text fontWeight="semiBold">
                        {formatMessage(translationStrings.length)}
                      </Text>
                    </Table.Data>
                    <Table.Data>
                      <Text>
                        {numberFormatter.format(shipInformation.length)}{' '}
                        {formatMessage(translationStrings.lengthMeasurement)}
                      </Text>
                    </Table.Data>
                  </Table.Row>
                )}
                {(shipInformation.manufacturer ||
                  typeof shipInformation.manufactionYear === 'number') && (
                  <Table.Row>
                    <Table.Data>
                      <Text fontWeight="semiBold">
                        {formatMessage(translationStrings.constructed)}
                      </Text>
                    </Table.Data>
                    <Table.Data>
                      <Text>
                        {shipInformation.manufactionYear}{' '}
                        {shipInformation.manufacturer &&
                          formatMessage(translationStrings.manufacturedBy)}{' '}
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
                          {formatMessage(translationStrings.owners)}
                        </Text>
                      </Table.Data>
                      <Table.Data>
                        <Stack space={2}>
                          {shipInformation.owners?.map((owner) => (
                            <Box>
                              <Text>
                                {owner?.name}{' '}
                                {owner?.nationalId
                                  ? `${formatMessage(
                                      translationStrings.nationalIdPrefix,
                                    )} ${owner.nationalId}`
                                  : ''}
                              </Text>
                              <Text>
                                {typeof owner?.sharePercentage === 'number'
                                  ? `${owner.sharePercentage}% ${formatMessage(
                                      translationStrings.sharePercentageProperty,
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
