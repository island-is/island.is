import React, { FC } from 'react'
import { Stack } from '@island.is/island-ui/core'
import {
  Table,
  Head,
  Row,
  HeadData,
  Data,
  Body,
} from '@island.is/skilavottord-web/components'
import { getDate, getYear } from '@island.is/skilavottord-web/utils/dateUtils'
import { VehicleOwner } from '@island.is/skilavottord-web/types'

interface TableProps {
  titles: string[]
  vehicleOwner: VehicleOwner[]
}

export const CarsTable: FC<TableProps> = ({ titles, vehicleOwner }) => {
  return (
    <Stack space={5}>
      <Table>
        <Head>
          <Row>
            {titles.map((title, index) => (
              <HeadData key={index} textVariant="small">
                {title}
              </HeadData>
            ))}
          </Row>
        </Head>
        <Body>
          {vehicleOwner.map(({ vehicles }) =>
            vehicles.map(
              ({ vehicleId, vehicleType, newregDate, recyclingRequests }) =>
                recyclingRequests.map(
                  ({ requestType, nameOfRequestor, createdAt }) => {
                    const modelYear = getYear(newregDate)
                    const deregistrationDate = getDate(createdAt)
                    if (requestType === 'deregistered') {
                      return (
                        <Row key={vehicleId}>
                          <Data textVariant="h5">{vehicleId}</Data>
                          <Data>{vehicleType}</Data>
                          <Data>{modelYear}</Data>
                          <Data>{nameOfRequestor}</Data>
                          <Data>{deregistrationDate}</Data>
                        </Row>
                      )
                    }
                  },
                ),
            ),
          )}
        </Body>
      </Table>
    </Stack>
  )
}

export default CarsTable
