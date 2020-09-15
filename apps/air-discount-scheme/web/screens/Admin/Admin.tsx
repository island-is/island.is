import React, { useState, useContext } from 'react'
import { useQuery } from '@apollo/client'
import { SubmitHandler } from 'react-hook-form'
import { is } from 'date-fns/locale'
import { format } from 'date-fns'
import gql from 'graphql-tag'

import { FlightLegsInput } from '@island.is/air-discount-scheme/types'
import { Layout } from '@island.is/air-discount-scheme-web/components'
import { Airlines } from '@island.is/air-discount-scheme/consts'
import { NotFound } from '@island.is/air-discount-scheme-web/screens'
import { UserContext } from '@island.is/air-discount-scheme-web/context'
import {
  Table,
  Row,
  Head,
  HeadData,
  Body,
  Data,
} from '@island.is/air-discount-scheme-web/components/Table'
import {
  Box,
  Stack,
  Typography,
  GridRow,
  GridColumn,
  Button,
} from '@island.is/island-ui/core'
import { Filters } from './components'
import { Screen } from '../../types'

const FlightLegsQuery = gql`
  query FlightLegsQuery($input: FlightLegsInput!) {
    flightLegs(input: $input) {
      id
      travel
      airline
      flight {
        id
        bookingDate
        userInfo {
          age
          gender
          postalCode
        }
      }
    }
  }
`

const TODAY = new Date()

export type FilterInput = FlightLegsInput & {
  airline: { value: string }
}

const Admin: Screen = ({}) => {
  const { user } = useContext(UserContext)
  const [filters, setFilters] = useState<FilterInput>({
    state: [],
    period: {
      from: new Date(TODAY.getFullYear(), TODAY.getMonth(), 1, 0, 0, 0),
      to: TODAY,
    },
  } as any)
  const { data, loading } = useQuery(FlightLegsQuery, {
    ssr: false,
    variables: {
      input: {
        ...filters,
        airline:
          filters.airline?.value === Airlines.norlandair
            ? [Airlines.icelandair, Airlines.norlandair]
            : filters.airline?.value,
        gender:
          filters.gender?.length === 2 ? undefined : (filters.gender || [])[0],
        age: {
          from: parseInt(Number(filters.age?.from).toString()) || -1,
          to: parseInt(Number(filters.age?.to).toString()) || 1000,
        },
        postalCode: filters.postalCode
          ? parseInt(filters.postalCode.toString())
          : undefined,
      },
    },
  })
  const { flightLegs = [] } = data ?? {}

  if (loading) {
    return null
  } else if (!['admin', 'developer'].includes(user?.role)) {
    return <NotFound />
  }

  const applyFilters: SubmitHandler<FilterInput> = (data: FilterInput) => {
    setFilters(data)
  }

  return (
    <Layout
      main={
        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '12/12', '12/12', '7/9']}
            offset={[null, null, null, null, '1/9']}
          >
            <Box marginBottom={[3, 3, 3, 12]}>
              <Stack space={3}>
                <Typography variant="h1" as="h1">
                  Yfirlit
                </Typography>
                <Typography variant="intro" links>
                  Hér má sjá yfirlit yfir flug
                </Typography>
                <Box paddingBottom={5} paddingTop={5}>
                  <Stack space={3}>
                    <Typography variant="h2" as="h2">
                      <span>Sjá nánar</span>
                    </Typography>
                  </Stack>
                </Box>

                <Box marginBottom={6}>
                  <Table>
                    <Head>
                      <Row>
                        <HeadData>Kyn</HeadData>
                        <HeadData>Aldur</HeadData>
                        <HeadData>Póstnúmer</HeadData>
                        <HeadData>Flugferð</HeadData>
                        <HeadData>Flugfélag</HeadData>
                        <HeadData>Bókun</HeadData>
                      </Row>
                    </Head>
                    <Body>
                      {flightLegs.map((flightLeg) => (
                        <Row key={flightLeg.id}>
                          <Data>{flightLeg.flight.userInfo.gender}</Data>
                          <Data>{flightLeg.flight.userInfo.age}</Data>
                          <Data>{flightLeg.flight.userInfo.postalCode}</Data>
                          <Data>{flightLeg.travel}</Data>
                          <Data>{flightLeg.airline}</Data>
                          <Data>
                            {format(
                              new Date(flightLeg.flight.bookingDate),
                              'dd. MMMM - k:mm',
                              {
                                locale: is,
                              },
                            )}
                          </Data>
                        </Row>
                      ))}
                    </Body>
                  </Table>
                </Box>
              </Stack>
            </Box>
          </GridColumn>
        </GridRow>
      }
      aside={
        <Stack space={3}>
          <Box
            background="purple100"
            padding={4}
            marginBottom={3}
            borderRadius="standard"
          >
            <Box marginBottom={2}>
              <Typography variant="h4">Síun</Typography>
            </Box>
            <Filters onSubmit={applyFilters} defaultValues={filters} />
          </Box>
          <Box
            background="purple100"
            padding={4}
            marginBottom={3}
            borderRadius="standard"
          >
            <Box marginBottom={2}>
              <Typography variant="h4">Aðgerðir</Typography>
            </Box>
            <Box paddingTop={2}>
              <Button width="fluid" variant="ghost">
                Búa til reikning
              </Button>
            </Box>
          </Box>
        </Stack>
      }
    />
  )
}

Admin.getInitialProps = () => ({})

export default Admin
