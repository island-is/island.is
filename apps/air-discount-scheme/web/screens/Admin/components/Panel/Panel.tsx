import React from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { is } from 'date-fns/locale'
import { format } from 'date-fns'

import { Airlines } from '@island.is/air-discount-scheme/consts'
import {
  Table,
  Row,
  Head,
  HeadData,
  Body,
  Data,
} from '@island.is/air-discount-scheme-web/components/Table'
import {
  SkeletonLoader,
  Typography,
  Box,
  Stack,
} from '@island.is/island-ui/core'
import { FilterInput, financialStateOptions } from '../../consts'
import { Summary } from '../'
import * as styles from './Panel.treat'

const FlightLegsQuery = gql`
  query FlightLegsQuery($input: FlightLegsInput!) {
    flightLegs(input: $input) {
      id
      travel
      airline
      originalPrice
      discountPrice
      financialState
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

interface PropTypes {
  filters: FilterInput
}

function Panel({ filters }: PropTypes) {
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
    return <SkeletonLoader height={500} />
  }

  const translateGender = (gender: 'kk' | 'kvk'): string => {
    if (gender === 'kk') {
      return 'karlmaður'
    } else if (gender === 'kvk') {
      return 'kvenmaður'
    }
    return 'manneskja'
  }

  return (
    <Stack space={3}>
      <Typography variant="h1" as="h1">
        Yfirlit
      </Typography>
      <Typography variant="intro">
        Samantektin byggist á núverandi síu
      </Typography>

      <Stack space={3}>
        <Summary flightLegs={flightLegs} airline={Airlines.ernir} />
        <Summary flightLegs={flightLegs} airline={Airlines.icelandair} />
        <Summary flightLegs={flightLegs} airline={Airlines.norlandair} />
      </Stack>

      <Box paddingBottom={2} paddingTop={5}>
        <Typography variant="h3" as="h3">
          <span>Niðurstaða</span>
        </Typography>
      </Box>

      <Box marginBottom={6}>
        <Table>
          <Head>
            <Row>
              <HeadData>Notandi</HeadData>
              <HeadData>Flug</HeadData>
              <HeadData>Staða</HeadData>
              <HeadData alignRight>Verð (kr.)</HeadData>
            </Row>
          </Head>
          <Body>
            {flightLegs.map((flightLeg) => (
              <Row key={flightLeg.id}>
                <Data>
                  <Box display="flex" flexDirection="column">
                    <Typography>
                      {flightLeg.flight.userInfo.age} ára{' '}
                      {translateGender(flightLeg.flight.userInfo.gender)}
                    </Typography>
                    <Typography color="dark300" variant="pSmall">
                      með póstnúmer {flightLeg.flight.userInfo.postalCode}
                    </Typography>
                  </Box>
                </Data>
                <Data>
                  <Box display="flex" flexDirection="column">
                    {flightLeg.travel}
                    <Typography color="dark300" variant="pSmall">
                      {format(
                        new Date(flightLeg.flight.bookingDate),
                        'dd. MMMM - k:mm',
                        {
                          locale: is,
                        },
                      )}
                    </Typography>
                    <Typography color="dark300" variant="pSmall">
                      <span className={styles.capitalize}>
                        {flightLeg.airline}
                      </span>
                    </Typography>
                  </Box>
                </Data>
                <Data>
                  {
                    (
                      financialStateOptions.find(
                        (state) => state.value === flightLeg.financialState,
                      ) || { label: '-' }
                    ).label
                  }
                </Data>
                <Data alignRight>
                  <Box display="flex" flexDirection="column">
                    <Typography color="blue400" variant="h4">
                      {flightLeg.discountPrice.toLocaleString('de-DE')}.-
                    </Typography>
                    <Typography color="dark300" variant="pSmall">
                      {flightLeg.originalPrice.toLocaleString('de-DE')}.-
                    </Typography>
                  </Box>
                </Data>
              </Row>
            ))}
          </Body>
        </Table>
      </Box>
    </Stack>
  )
}

export default Panel
