import React from 'react'
import is from 'date-fns/locale/is'
import format from 'date-fns/format'

import { Text, Box, Table } from '@island.is/island-ui/core'
import { financialStateOptions } from '../../consts'
import * as styles from './Panel.css'
import { FlightLeg } from '../../types'

interface PropTypes {
  flightLegs: FlightLeg[]
}

function Panel({ flightLegs }: PropTypes) {
  const translateGender = (gender: string): string => {
    if (gender === 'kk') {
      return 'karlmaður'
    } else if (gender === 'kvk') {
      return 'kvenmaður'
    } else if (gender === 'hvk') {
      return 'kynsegin/annað'
    }
    return 'manneskja'
  }

  return (
    <Box marginBottom={6}>
      <Table.Table>
        <Table.Head>
          <Table.Row>
            <Table.HeadData>Notandi</Table.HeadData>
            <Table.HeadData>Flug</Table.HeadData>
            <Table.HeadData>Staða</Table.HeadData>
            <Table.HeadData align="right">Verð (kr.)</Table.HeadData>
            <Table.HeadData align="right">Afsláttur (kr.)</Table.HeadData>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {flightLegs.map((flightLeg) => (
            <Table.Row key={flightLeg.id}>
              <Table.Data>
                <Box display="flex" flexDirection="column">
                  <Text>
                    {flightLeg.flight.userInfo.age} ára{' '}
                    {translateGender(flightLeg.flight.userInfo.gender)}
                  </Text>
                  <Text color="dark300" variant="small">
                    með póstnúmer {flightLeg.flight.userInfo.postalCode}
                  </Text>
                </Box>
              </Table.Data>
              <Table.Data>
                <Box display="flex" flexDirection="column">
                  {flightLeg.travel}
                  <Text color="dark300" variant="small">
                    {format(
                      new Date(flightLeg.flight.bookingDate),
                      'dd. MMMM - k:mm',
                      {
                        locale: is,
                      },
                    )}
                  </Text>
                  <Text color="dark300" variant="small">
                    <span className={styles.capitalize}>
                      {flightLeg.airline}{' '}
                      {flightLeg.cooperation
                        ? `+ ${flightLeg.cooperation}`
                        : ''}
                    </span>
                  </Text>
                </Box>
              </Table.Data>
              <Table.Data>
                {
                  (
                    financialStateOptions.find(
                      (state) => state.value === flightLeg.financialState,
                    ) || { label: '-' }
                  ).label
                }
              </Table.Data>
              <Table.Data align="right">
                <Box display="flex" flexDirection="column">
                  <Text color="blue400" variant="h4">
                    {flightLeg.discountPrice.toLocaleString('de-DE')}.-
                  </Text>
                  <Text color="dark300" variant="small">
                    {flightLeg.originalPrice.toLocaleString('de-DE')}.-
                  </Text>
                </Box>
              </Table.Data>
              <Table.Data align="right">
                <Text color="red400" variant="h4">
                  {(
                    flightLeg.originalPrice - flightLeg.discountPrice
                  ).toLocaleString('de-DE')}
                  .-
                </Text>
              </Table.Data>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Table>
    </Box>
  )
}

export default Panel
