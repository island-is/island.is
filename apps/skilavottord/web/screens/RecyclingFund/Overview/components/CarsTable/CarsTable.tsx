import React, { FC } from 'react'
import { Stack, Table as T, Text } from '@island.is/island-ui/core'
import { getDate, getYear } from '@island.is/skilavottord-web/utils'
import { Vehicle } from '@island.is/skilavottord-web/graphql/schema'

interface TableProps {
  titles: string[]
  vehicles: Vehicle[]
}

export const CarsTable: FC<React.PropsWithChildren<TableProps>> = ({
  titles,
  vehicles,
}) => {
  const { Table, Head, Row, HeadData, Body, Data } = T
  return (
    <Table>
      <Head>
        <Row>
          {titles.map((title, index) => (
            <HeadData key={index}>
              <Text variant="eyebrow">{title}</Text>
            </HeadData>
          ))}
        </Row>
      </Head>
      <Body>
        {vehicles.map(
          ({ vehicleId, vehicleType, newregDate, recyclingRequests }) => {
            return recyclingRequests?.map(({ createdAt, nameOfRequestor }) => {
              const modelYear = getYear(newregDate)
              const deregistrationDate = getDate(createdAt)
              return (
                <Row key={vehicleId}>
                  <Data>
                    <Text variant="eyebrow">{vehicleId}</Text>
                  </Data>
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
  )
}

export default CarsTable
