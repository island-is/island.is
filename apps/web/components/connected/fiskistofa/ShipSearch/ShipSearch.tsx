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
  FiskistofaShipBasicInfoResponse,
} from '@island.is/api/schema'
import { GET_SHIPS_QUERY } from './queries'
import { useNamespace } from '@island.is/web/hooks'

interface ShipSearchProps {
  namespace: {
    shipDetailsHref?: string
    searchStringIsTooShort?: string
    resultsFound?: string
    search?: string
    noResultsFound?: string
    errorOccuredWhileFetchingShips?: string
    shipNumber?: string
    shipName?: string
    operator?: string
    typeOfVessel?: string
    homePort?: string
    shipSearchInputLabel?: string
  }
}

const ShipSearch = ({ namespace }: ShipSearchProps) => {
  const n = useNamespace(namespace)

  const [nameInput, setNameInput] = useState('')
  const [nameInputDuringLastSearch, setNameInputDuringLastSearch] = useState('')

  const [inputError, setInputError] = useState('')
  const router = useRouter()

  const getShipDetailsHref = (id: number) => {
    return `${n(
      'shipDetailsHref',
      '/v/gagnasidur-fiskistofu?selectedTab=skip',
    )}&nr=${id}`
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
      setInputError(
        n(
          'searchStringIsTooShort',
          'Leitarstrengur þarf að vera a.m.k. 2 stafir',
        ),
      )
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
        label={n('shipSearchInputLabel', 'Skipaskrárnúmer eða nafn skips')}
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
          {n('search', 'Leita')}
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
          <Text>{n('noResultsFound', 'Engar niðurstöður fundust')}</Text>
        </Box>
      )}

      {error && (
        <Box display="flex" justifyContent="center">
          <Text>
            {n(
              'errorOccuredWhileFetchingShips',
              'Villa kom upp við að leita eftir skipi',
            )}
          </Text>
        </Box>
      )}

      {ships.length > 0 && (
        <>
          <Text color="blue600">
            {n('resultsFound', 'Fjöldi skipa:')} {ships.length}
          </Text>
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>{n('shipNumber', 'Skipnr.')}</T.HeadData>
                <T.HeadData>{n('shipName', 'Nafn')}</T.HeadData>
                <T.HeadData>{n('typeOfVessel', 'Útgerðarflokkur')}</T.HeadData>
                <T.HeadData>{n('operator', 'Útgerð')}</T.HeadData>
                <T.HeadData>{n('homePort', 'Heimahöfn')}</T.HeadData>
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
