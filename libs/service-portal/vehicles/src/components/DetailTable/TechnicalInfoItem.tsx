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
          value={data.vehicleWeight + ' kg'}
        />
      </Row>
      <Row>
        <Column label={messages.capacity} value={data.cubicCapacity + ' cc.'} />

        <Column
          label={messages.vehicleWeight}
          value={data.capacityWeight + ' kg'}
        />
      </Row>
      <Row>
        <Column label={messages.length} value={data.length + ' mm'} />
        <Column label={messages.totalWeight} value={data.totalWeight + ' kg'} />
      </Row>
      <Row>
        <Column label={messages.width} value={data.width + ' mm'} />
        <Column
          label={messages.trailerWithoutBrakes}
          value={data.trailerWithoutBrakesWeight + ' kg'}
        />
      </Row>
      <Row>
        <Column
          label={messages.horsePower}
          value={data.horsepower && data.horsepower + ' hö'}
        />
        <Column
          label={messages.trailerWithBrakes}
          value={data.trailerWithBrakesWeight + ' kg'}
        />
      </Row>
      <Row>
        <Column
          label={messages.carryingCapacity}
          value={data.carryingCapacity + ' kg'}
        />
        <Column
          label={messages.axleTotalWeight}
          value={data.axleTotalWeight ? data.axleTotalWeight + ' kg' : ''}
        />
      </Row>
      {data.axle?.map((item: VehiclesAxle | null, index: number) => {
        const axleTitle = messages.axle
        const axleWheel = messages.axleWheel
        const tyreNr = `tyre${index + 1}` as keyof Tyres
        return (
          <Row key={'Axle: ' + index}>
            <Column label={axleTitle} value={index + 1} />
            <Column label={axleWheel} value={data.tyres?.[tyreNr]} />
          </Row>
        )
      })}
    </Box>
  )
}

export default TechnicalInfoItem
