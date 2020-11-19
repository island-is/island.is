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

interface TableProps {
  titles: string[]
  deregisteredVehicles: DeregisteredVehicle[]
}
interface DeregisteredVehicle {
  vehicleId: string
  vehicleType: string
  modelYear: string
  nameOfRequestor: string
  deregistrationDate: string
}

export const CarsTable: FC<TableProps> = ({ titles, deregisteredVehicles }) => {
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
          {deregisteredVehicles.map(
            ({
              vehicleId,
              vehicleType,
              modelYear,
              nameOfRequestor,
              deregistrationDate,
            }) => (
              <Row key={vehicleId}>
                <Data textVariant="h5">{vehicleId}</Data>
                <Data>{vehicleType}</Data>
                <Data>{modelYear}</Data>
                <Data>{nameOfRequestor}</Data>
                <Data>{deregistrationDate}</Data>
              </Row>
            ),
          )}
        </Body>
      </Table>
    </Stack>
  )
}

export default CarsTable
