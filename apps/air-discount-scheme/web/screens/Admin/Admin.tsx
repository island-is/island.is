import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { is } from 'date-fns/locale'
import { format } from 'date-fns'
import gql from 'graphql-tag'

import { Layout } from '@island.is/air-discount-scheme-web/components'
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
} from '@island.is/island-ui/core'
import { Screen } from '../../types'

const FlightsQuery = gql`
  query FlightsQuery($input: FlightsInput!) {
    flights(input: $input) {
      id
      bookingDate
      travel
      userInfo {
        age
        gender
        postalCode
      }
    }
  }
`
const Admin: Screen = ({}) => {
  const { user } = useContext(UserContext)
  if (!['admin', 'developer'].includes(user?.role)) {
    return <NotFound />
  }

  const { data } = useQuery(FlightsQuery, {
    ssr: false,
    variables: {
      input: { gender: 'kvk' },
    },
  })
  const { flights = [] } = data ?? {}

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
                        <HeadData>Notandi</HeadData>
                        <HeadData>Flugferð</HeadData>
                        <HeadData>Bókun</HeadData>
                      </Row>
                    </Head>
                    <Body>
                      {flights.map((flight) => (
                        <Row key={flight.id}>
                          <Data>{flight.userInfo.gender}</Data>
                          <Data>{flight.travel}</Data>
                          <Data>
                            {format(
                              new Date(flight.bookingDate),
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
      aside={<Stack space={3}>Filters</Stack>}
    />
  )
}

Admin.getInitialProps = () => ({})

export default Admin
