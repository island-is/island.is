import React from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import { Box, Typography } from '@island.is/island-ui/core'
import {
  Table,
  Row,
  Head,
  HeadData,
  Body,
  Data,
} from '@island.is/air-discount-scheme-web/components/Table/Table'

const FlightsQuery = gql`
  query FlightsQuery {
    flights {
      id
      bookingDate
      travel
      user {
        nationalId
        name
      }
    }
  }
`

interface PropTypes {
  misc: string
}

function Usage({ misc }: PropTypes) {
  const { data } = useQuery(FlightsQuery, { ssr: true })
  const { flights } = data || {}

  return (
    <Box marginBottom={6} paddingTop={6}>
      <Box marginBottom={3}>
        <Typography variant="h3">Notkun á núverandi tímabili</Typography>
      </Box>
      <Table>
        <Head>
          <Row>
            <HeadData>Notandi</HeadData>
            <HeadData>Leggur</HeadData>
            <HeadData>Dagsetning</HeadData>
          </Row>
        </Head>
        <Body>
          {flights &&
            flights.map((flight) => (
              <Row key={flight.id}>
                <Data>{flight.user.name}</Data>
                <Data>{flight.travel}</Data>
                <Data>{flight.bookingDate}</Data>
              </Row>
            ))}
        </Body>
      </Table>
    </Box>
  )
}

export default Usage
