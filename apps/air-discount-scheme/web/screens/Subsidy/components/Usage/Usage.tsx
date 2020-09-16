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
} from '@island.is/air-discount-scheme-web/components/Table'
import { format } from 'date-fns'
import { is, enGB } from 'date-fns/locale'
import { useI18n } from '@island.is/air-discount-scheme-web/i18n'

const THIRTY_SECONDS = 30000 // milli-seconds

const UserFlightLegsQuery = gql`
  query UserFlightLegsQuery {
    user {
      nationalId
      flightLegs {
        id
        travel
        flight {
          id
          bookingDate
          user {
            nationalId
            name
          }
        }
      }
    }
  }
`

interface PropTypes {
  misc: string
}

function Usage({ misc }: PropTypes) {
  const { data } = useQuery(UserFlightLegsQuery, {
    ssr: false,
    pollInterval: THIRTY_SECONDS,
  })
  const { user } = data || {}
  const flightLegs = user?.flightLegs || []
  const { currentUsage, user: userTitle, path, date } = JSON.parse(misc)
  const { activeLocale } = useI18n()

  if (flightLegs.length <= 0) {
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
            <HeadData>{userTitle}</HeadData>
            <HeadData>{path}</HeadData>
            <HeadData>{date}</HeadData>
          </Row>
        </Head>
        <Body>
          {flightLegs.map((flightLeg) => {
            const { user } = flightLeg.flight

            return (
              <Row key={flightLeg.id}>
                <Data>{user.name}</Data>
                <Data>{flightLeg.travel}</Data>
                <Data>
                  {format(
                    new Date(flightLeg.flight.bookingDate),
                    'dd. MMMM - k:mm',
                    {
                      locale: activeLocale === 'is' ? is : enGB,
                    },
                  )}
                </Data>
              </Row>
            )
          })}
        </Body>
      </Table>
    </Box>
  )
}

export default Usage
