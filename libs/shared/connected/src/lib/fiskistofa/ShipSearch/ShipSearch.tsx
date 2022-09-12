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
import { QueryGetShipsArgs, ShipBasicInfo } from '@island.is/web/graphql/schema'
import { GET_SHIPS_QUERY } from './queries'

interface ShipSearchProps {
  shipDetailsHref?: string
}

export const ShipSearch = ({
  shipDetailsHref = '/s/fiskistofa/skip',
}: ShipSearchProps) => {
  const [nameInput, setNameInput] = useState('')
  const [nameInputDuringLastSearch, setNameInputDuringLastSearch] = useState('')

  const [inputError, setInputError] = useState('')
  const router = useRouter()

  const getShipDetailsHref = (id: number) => {
    return `${shipDetailsHref}?nr=${id}`
  }

  const [loadShips, { data, error, loading, called }] = useLazyQuery<
    { getShips: ShipBasicInfo[] },
    QueryGetShipsArgs
  >(GET_SHIPS_QUERY)

  useEffect(() => {
    if (router?.query?.name) {
      setNameInput(router.query.name as string)
      setNameInputDuringLastSearch(router.query.name as string)
      loadShips({
        variables: { input: { shipName: router.query.name as string } },
      })
    }
  }, [router?.query?.name])

  const ships = data?.getShips ?? ([] as ShipBasicInfo[])

  const handleShipSearch = () => {
    const nameInputIsNumber = !isNaN(Number(nameInput)) && nameInput.length > 0
    if (!nameInputIsNumber && nameInput.length < 2) {
      setInputError('Leitarstrengur þarf að vera a.m.k. 2 stafir')
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
        name="skipaskrarnumer-eda-nafn-skips"
        label="Skipaskrárnúmer eða nafn skips"
        value={nameInput}
        onChange={(ev) => setNameInput(ev.target.value)}
        hasError={inputError.length > 0}
        errorMessage={inputError}
        onKeyDown={(ev) => {
          if (ev.key === 'Enter') {
            handleShipSearch()
          }
        }}
      />
      <Box marginTop={3}>
        <Button
          disabled={
            nameInput === nameInputDuringLastSearch && nameInput.length > 0
          }
          onClick={handleShipSearch}
        >
          Leita
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
          <Text>Engar niðurstöður fundust</Text>
        </Box>
      )}

      {error && (
        <Box display="flex" justifyContent="center">
          <Text>Villa kom upp við að leita eftir skipi</Text>
        </Box>
      )}

      {ships.length > 0 && (
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>Skipnr.</T.HeadData>
              <T.HeadData>Nafn</T.HeadData>
              <T.HeadData>Útgerðarflokkur</T.HeadData>
              <T.HeadData>Útgerð</T.HeadData>
              <T.HeadData>Heimahöfn</T.HeadData>
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
      )}
    </Box>
  )
}
