import { useState } from 'react'
import { useQuery } from '@apollo/client'
import {
  Box,
  Button,
  Input,
  LoadingDots,
  Table as T,
} from '@island.is/island-ui/core'
import { QueryGetShipsArgs, ShipBasicInfo } from '@island.is/web/graphql/schema'
import { GET_SHIPS_QUERY } from './queries'

const linkResolver = {
  shipDetailsPage: {
    is: '/s/fiskistofa/skip',
    en: '/en/o/directorate-of-fisheries/ship',
  },
}

interface ShipSearchProps {
  shipDetailsHref?: string
}

export const ShipSearch = ({
  shipDetailsHref = '/s/fiskistofa/skip',
}: ShipSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('')

  const [searchQuery, setSearchQuery] = useState<string>('')

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

  return (
    <Box>
      <Input
        name="skipaskrarnumer-eda-nafn-skips"
        label="Skipaskrárnúmer eða nafn skips"
        value={searchTerm}
        onChange={(ev) => setSearchTerm(ev.target.value)}
      />
      <Box marginTop={3}>
        <Button
          onClick={() => {
            setSearchQuery(searchTerm)
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
            const href = `${shipDetailsHref}?nr=${ship.id}`

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
    </Box>
  )
}
