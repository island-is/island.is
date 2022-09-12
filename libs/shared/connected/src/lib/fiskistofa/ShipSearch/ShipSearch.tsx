import { useRef, useState } from 'react'
import { useQuery } from '@apollo/client'
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
import { useRouter } from 'next/router'

interface ShipSearchProps {
  shipDetailsHref?: string
}

export const ShipSearch = ({
  shipDetailsHref = '/s/fiskistofa/skip',
}: ShipSearchProps) => {
  const [nameInput, setNameInput] = useState('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const hasSearched = useRef(false)
  const [inputError, setInputError] = useState('')
  const router = useRouter()

  const getShipDetailsHref = (id: number) => {
    return `${shipDetailsHref}?nr=${id}`
  }

  const response = useQuery<{ getShips: ShipBasicInfo[] }, QueryGetShipsArgs>(
    GET_SHIPS_QUERY,
    {
      variables: {
        input: {
          shipName: searchQuery,
        },
      },
    },
  )

  const ships = response?.data?.getShips ?? ([] as ShipBasicInfo[])
  const loading = response.loading && searchQuery.length > 0

  const searchForShips = () => {
    const nameInputIsNumber = !isNaN(Number(nameInput))
    if (!nameInputIsNumber && nameInput.length < 2) {
      setInputError('Leitarstrengur þarf að vera a.m.k. 2 stafir')
      return
    } else {
      setInputError('')
    }
    if (nameInputIsNumber) {
      router.push(getShipDetailsHref(Number(nameInput)))
    } else {
      hasSearched.current = true
      setSearchQuery(nameInput)
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
            searchForShips()
          }
        }}
      />
      <Box marginTop={3}>
        <Button
          onClick={() => {
            searchForShips()
          }}
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
      {ships.length === 0 && hasSearched.current && !loading && (
        <Box display="flex" justifyContent="center">
          <Text>Engar niðurstöður fundust</Text>
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
