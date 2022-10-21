import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  Input,
  LoadingDots,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import {
  QueryFiskistofaGetShipsArgs as QueryGetShipsArgs,
  FiskistofaShipBasicInfo as ShipBasicInfo,
} from '@island.is/api/schema'
import { GET_SHIPS_QUERY } from './queries'

interface ShipSearchProps {
  shipDetailsHref?: string
  searchStringIsTooShort?: string
  resultsFound?: string
  search?: string
  noResultsFound?: string
  errorOccuredWhileFetchingShips?: string
  shipNumber?: string
  shipName?: string
  shippingCompany?: string
  shippingClass?: string
  homePort?: string
  shipSearchInputLabel?: string
}

export const ShipSearch = ({
  shipDetailsHref = '/v/maelabord-fiskistofu?selectedTab=skip',
  searchStringIsTooShort = 'Leitarstrengur þarf að vera a.m.k. 2 stafir',
  resultsFound = 'Fjöldi skipa:',
  search = 'Leita',
  noResultsFound = ' Engar niðurstöður fundust',
  errorOccuredWhileFetchingShips = 'Villa kom upp við að leita eftir skipi',
  shipNumber = 'Skipnr.',
  shipName = 'Nafn',
  shippingCompany = 'Útgerð',
  shippingClass = 'Útgerðarflokkur',
  homePort = 'Heimahöfn',
  shipSearchInputLabel = 'Skipaskrárnúmer eða nafn skips',
}: ShipSearchProps) => {
  const [nameInput, setNameInput] = useState('')
  const [nameInputDuringLastSearch, setNameInputDuringLastSearch] = useState('')

  const [inputError, setInputError] = useState('')
  const router = useRouter()

  const getShipDetailsHref = (id: number) => {
    return `${shipDetailsHref}&nr=${id}`
  }

  const [loadShips, { data, error, loading, called }] = useLazyQuery<
    { fiskistofaGetShips: ShipBasicInfo[] },
    QueryGetShipsArgs
  >(GET_SHIPS_QUERY)

  useEffect(() => {
    if (router?.query?.name) {
      setNameInput(router.query.name as string)
      handleShipSearch(router.query.name as string)
    }
  }, [router?.query?.name])

  const ships = data?.fiskistofaGetShips ?? ([] as ShipBasicInfo[])

  const handleShipSearch = (nameInput: string) => {
    const nameInputIsNumber = !isNaN(Number(nameInput)) && nameInput.length > 0
    if (!nameInputIsNumber && nameInput.length < 2) {
      setInputError(searchStringIsTooShort)
      return
    } else {
      setInputError('')
    }
    if (nameInputIsNumber) {
      router.push(getShipDetailsHref(Number(nameInput)))
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
        label={shipSearchInputLabel}
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
          {search}
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
          <Text>{noResultsFound}</Text>
        </Box>
      )}

      {error && (
        <Box display="flex" justifyContent="center">
          <Text>{errorOccuredWhileFetchingShips}</Text>
        </Box>
      )}

      {ships.length > 0 && (
        <>
          <Text color="blue600">
            {resultsFound} {ships.length}
          </Text>
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>{shipNumber}</T.HeadData>
                <T.HeadData>{shipName}</T.HeadData>
                <T.HeadData>{shippingCompany}</T.HeadData>
                <T.HeadData>{shippingClass}</T.HeadData>
                <T.HeadData>{homePort}</T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {ships.map((ship) => {
                const href = getShipDetailsHref(ship.id)
                return (
                  <T.Row key={ship.id}>
                    <T.Data>
                      <a href={href}>{ship.id}</a>
                    </T.Data>
                    <T.Data>
                      <a href={href}>{ship.name}</a>
                    </T.Data>
                    <T.Data>{ship.shippingCompany}</T.Data>
                    <T.Data>{ship.shippingClass}</T.Data>
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
