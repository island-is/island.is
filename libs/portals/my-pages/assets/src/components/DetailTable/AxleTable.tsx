import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { Tyres, VehiclesAxle } from '@island.is/api/schema'
import { vehicleMessage as messages } from '../../lib/messages'
import { displayWithUnit } from '../../utils/displayWithUnit'

interface PropTypes {
  axles?: VehiclesAxle[] | null
  tyres?: Tyres | null
}

const AxleTable = ({ axles, tyres }: PropTypes) => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()

  const tyreArray: string[] = []
  tyreArray.push(tyres?.axle1 ?? '')
  tyreArray.push(tyres?.axle2 ?? '')
  tyreArray.push(tyres?.axle3 ?? '')
  tyreArray.push(tyres?.axle4 ?? '')
  tyreArray.push(tyres?.axle5 ?? '')

  return (
    <Box marginBottom={4} marginTop="containerGutter">
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(messages.axle)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(messages.axleTotalWeight)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(messages.axleWheel)}
              </Text>
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {axles?.map((item: VehiclesAxle, index) => {
            return (
              <T.Row key={index + 'axle table'}>
                <T.Data>
                  <Text variant="medium">{index + 1}</Text>
                </T.Data>
                <T.Data>
                  <Text variant="medium">
                    {displayWithUnit(item?.axleMaxWeight?.toString(), 'kg')}
                  </Text>
                </T.Data>
                <T.Data>
                  <Text variant="medium">{tyreArray[index]}</Text>
                </T.Data>
              </T.Row>
            )
          })}
        </T.Body>
      </T.Table>
    </Box>
  )
}

export default AxleTable
