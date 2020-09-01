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
import { format } from 'date-fns'
import { is } from 'date-fns/locale'

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
  const { flights = [] } = data ?? {}
  const { currentUsage, user, path, date } = JSON.parse(misc)

  if (flights.length <= 0) {
    return null
  }

  return (
    <Box marginBottom={6} paddingTop={6}>
      <Box marginBottom={3}>
        <Typography variant="h3">{currentUsage}</Typography>
      </Box>
      <Table>
        <Head>
          <Row>
            <HeadData>{user}</HeadData>
            <HeadData>{path}</HeadData>
            <HeadData>{date}</HeadData>
          </Row>
        </Head>
        <Body>
          {flights.map((flight) => (
            <Row key={flight.id}>
              <Data>{flight.user.name}</Data>
              <Data>{flight.travel}</Data>
              <Data>
                {format(new Date(flight.bookingDate), "dd. MMMM 'kl.' k:mm", {
                  locale: is,
                })}
              </Data>
            </Row>
          ))}
        </Body>
      </Table>
    </Box>
  )
}

export default Usage
