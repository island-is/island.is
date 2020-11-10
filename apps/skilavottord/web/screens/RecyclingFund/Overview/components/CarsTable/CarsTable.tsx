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
import { getDate, getYear } from '@island.is/skilavottord-web/utils'

interface TableProps {
  titles: string[]
  vehicles: any[]
}

export const CarsTable: FC<TableProps> = ({ titles, vehicles }) => {
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
          {vehicles.map(
            ({ vehicleId, vehicleType, newregDate, recyclingRequests }) => {
              return recyclingRequests.map(({ createdAt, nameOfRequestor }) => {
                const modelYear = getYear(newregDate)
                const deregistrationDate = getDate(createdAt)
                return (
                  <Row key={vehicleId}>
                    <Data textVariant="h5">{vehicleId}</Data>
                    <Data>{vehicleType}</Data>
                    <Data>{modelYear}</Data>
                    <Data>{nameOfRequestor}</Data>
                    <Data>{deregistrationDate}</Data>
                  </Row>
                )
              })
            },
          )}
        </Body>
      </Table>
    </Stack>
  )
}

export default CarsTable
