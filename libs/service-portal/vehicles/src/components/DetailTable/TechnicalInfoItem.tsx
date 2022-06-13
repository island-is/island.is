import React from 'react'
import HeaderRow from './HeaderRow'
import Column from './Column'
import Row from './Row'
import { Box } from '@island.is/island-ui/core'
import {
  VehiclesAxle,
  VehiclesTechnicalInfo,
  Tyres,
} from '@island.is/api/schema'
import { messages } from '../../lib/messages'
import { displayWithUnit } from '../../utils/displayWithUnit'

interface PropTypes {
  data: VehiclesTechnicalInfo
}

const TechnicalInfoItem = ({ data }: PropTypes) => {
  return (
    <Box marginBottom={4}>
      <HeaderRow>{messages.techTitle}</HeaderRow>
      <Row>
        <Column label={messages.engineType} value={data.engine} />
        <Column
          label={messages.vehicleWeight}
          value={displayWithUnit(data.vehicleWeight?.toString(), 'kg')}
        />
      </Row>
      <Row>
        <Column
          label={messages.capacity}
          value={displayWithUnit(data.cubicCapacity?.toString(), 'cc')}
        />

        <Column
          label={messages.capacityWeight}
          value={
            data.capacityWeight
              ? displayWithUnit(data.capacityWeight?.toString(), 'kg')
              : ''
          }
        />
      </Row>
      <Row>
        <Column
          label={messages.length}
          value={displayWithUnit(data.length?.toString(), 'mm')}
        />
        <Column
          label={messages.totalWeight}
          value={displayWithUnit(data.totalWeight?.toString(), 'kg')}
        />
      </Row>
      <Row>
        <Column
          label={messages.width}
          value={displayWithUnit(data.width?.toString(), 'mm')}
        />
        <Column
          label={messages.trailerWithoutBrakes}
          value={displayWithUnit(
            data.trailerWithoutBrakesWeight?.toString(),
            'kg',
          )}
        />
      </Row>
      <Row>
        <Column
          label={messages.horsePower}
          value={displayWithUnit(data.horsepower?.toString(), 'hö')}
        />
        <Column
          label={messages.trailerWithBrakes}
          value={displayWithUnit(
            data.trailerWithBrakesWeight?.toString(),
            'kg',
          )}
        />
      </Row>
      <Row>
        <Column
          label={messages.carryingCapacity}
          value={displayWithUnit(data.carryingCapacity?.toString(), 'kg')}
        />
        <Column
          label={messages.axleTotalWeight}
          value={
            data.axleTotalWeight
              ? displayWithUnit(data.axleTotalWeight?.toString(), 'kg')
              : ''
          }
        />
      </Row>
      {data.axles?.map((item: VehiclesAxle | null, index: number) => {
        const axleTitle = messages.axle
        const axleWheel = messages.axleWheel
        const axleNr = `axle${index + 1}` as keyof Tyres
        return (
          <Row key={'Axle: ' + index}>
            <Column label={axleTitle} value={index + 1} />
            <Column label={axleWheel} value={data.tyres?.[axleNr]} />
          </Row>
        )
      })}
    </Box>
  )
}

export default TechnicalInfoItem
