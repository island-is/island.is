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
import {
  Vehicle,
  RecyclingRequest,
} from '@island.is/skilavottord-web/graphql/schema'

interface TableProps {
  titles: string[]
  deregisteredVehicles: Vehicle[]
}

export const CarsTable: FC<React.PropsWithChildren<TableProps>> = ({
  titles,
  deregisteredVehicles,
}) => {
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
          {deregisteredVehicles.map((vehicle) => {
            const recyclingRequest =
              (vehicle.recyclingRequests || [])[0] || ({} as RecyclingRequest)
            return (
              <Row key={vehicle.vehicleId}>
                <Data textVariant="h5">{vehicle.vehicleId}</Data>
                <Data>{vehicle.vehicleType}</Data>
                <Data>{getYear(vehicle.newregDate)}</Data>
                <Data>{recyclingRequest.nameOfRequestor}</Data>
                <Data>{getDate(recyclingRequest.createdAt)}</Data>
              </Row>
            )
          })}
        </Body>
      </Table>
    </Stack>
  )
}

export default CarsTable
