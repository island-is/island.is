import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/client'

import {
  Box,
  Button,
  Input,
  LoadingDots,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { shouldLinkOpenInNewWindow } from '@island.is/shared/utils'
import {
  FiskistofaShipBasicInfo as ShipBasicInfo,
  FiskistofaShipBasicInfoResponse,
  QueryFiskistofaGetShipsArgs as QueryGetShipsArgs,
} from '@island.is/web/graphql/schema'

import { GET_SHIPS_QUERY } from './queries'
import { translation as translationStrings } from './translation.strings'

const ShipSearch = () => {
  const { formatMessage } = useIntl()

  const [nameInput, setNameInput] = useState('')
  const [nameInputDuringLastSearch, setNameInputDuringLastSearch] = useState('')

  const [inputError, setInputError] = useState('')
  const router = useRouter()

  const getShipDetailsHref = (id: number) => {
    const href = formatMessage(translationStrings.shipDetailsHref)

    const [pathname, params] = href.split('?')

    const queryParams = new URLSearchParams(params)
    queryParams.append(
      formatMessage(translationStrings.shipDetailsNumberQueryParam),
      String(id),
    )
    return `${pathname}?${queryParams.toString()}`
  }

  const [loadShips, { data, error, loading, called }] = useLazyQuery<
    { fiskistofaGetShips: FiskistofaShipBasicInfoResponse },
    QueryGetShipsArgs
  >(GET_SHIPS_QUERY)

  useEffect(() => {
    if (router?.query?.name) {
      setNameInput(router.query.name as string)
      handleShipSearch(router.query.name as string)
    }
  }, [router?.query?.name])

  const ships =
    data?.fiskistofaGetShips?.fiskistofaShips ?? ([] as ShipBasicInfo[])

  const handleShipSearch = (nameInput: string) => {
    const nameInputIsNumber = !isNaN(Number(nameInput)) && nameInput.length > 0
    if (!nameInputIsNumber && nameInput.length < 2) {
      setInputError(formatMessage(translationStrings.searchStringIsTooShort))
      return
    } else {
      setInputError('')
    }
    if (nameInputIsNumber) {
      const href = getShipDetailsHref(Number(nameInput))
      window.open(
        href,
        shouldLinkOpenInNewWindow(href) ? '_blank' : '_self',
        'noopener,noreferrer',
      )
    } else {
      setNameInputDuringLastSearch(nameInput)
      loadShips({
        variables: {
          input: {
            shipName: nameInput,
          },
        },
      })
    }
  }

  return (
    <Box>
      <Input
        name="ship-search"
        label={formatMessage(translationStrings.shipSearchInputLabel)}
        value={nameInput}
        onChange={(ev) => setNameInput(ev.target.value)}
        hasError={inputError.length > 0}
        errorMessage={inputError}
        onKeyDown={(ev) => {
          if (ev.key === 'Enter') {
            handleShipSearch(nameInput)
          }
        }}
      />
      <Box marginTop={3}>
        <Button
          disabled={
            nameInput === nameInputDuringLastSearch && nameInput.length > 0
          }
          onClick={() => handleShipSearch(nameInput)}
        >
          {formatMessage(translationStrings.search)}
        </Button>
      </Box>

      <Box
        style={{ visibility: loading ? 'visible' : 'hidden' }}
        display="flex"
        justifyContent="center"
        marginTop={3}
        marginBottom={3}
      >
        <LoadingDots />
      </Box>
      {ships.length === 0 && called && !loading && !error && (
        <Box display="flex" justifyContent="center">
          <Text>{formatMessage(translationStrings.noResultsFound)}</Text>
        </Box>
      )}

      {error && (
        <Box display="flex" justifyContent="center">
          <Text>
            {formatMessage(translationStrings.errorOccuredWhileFetchingShips)}
          </Text>
        </Box>
      )}

      {ships.length > 0 && (
        <>
          <Text color="blue600">
            {formatMessage(translationStrings.resultsFound)} {ships.length}
          </Text>
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>
                  {formatMessage(translationStrings.shipNumber)}
                </T.HeadData>
                <T.HeadData>
                  {formatMessage(translationStrings.shipName)}
                </T.HeadData>
                <T.HeadData>
                  {formatMessage(translationStrings.typeOfVessel)}
                </T.HeadData>
                <T.HeadData>
                  {formatMessage(translationStrings.operator)}
                </T.HeadData>
                <T.HeadData>
                  {formatMessage(translationStrings.homePort)}
                </T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {ships.map((ship) => {
                const href = getShipDetailsHref(ship.id)
                const target = shouldLinkOpenInNewWindow(href)
                  ? '_blank'
                  : '_self'
                return (
                  <T.Row key={ship.id}>
                    <T.Data>
                      <a href={href} rel="noreferrer" target={target}>
                        {ship.id}
                      </a>
                    </T.Data>
                    <T.Data>
                      <a href={href} rel="noreferrer" target={target}>
                        {ship.name}
                      </a>
                    </T.Data>
                    <T.Data>{ship.typeOfVessel}</T.Data>
                    <T.Data>{ship.operator}</T.Data>
                    <T.Data>{ship.homePort}</T.Data>
                  </T.Row>
                )
              })}
            </T.Body>
          </T.Table>
        </>
      )}
    </Box>
  )
}

export default ShipSearch
