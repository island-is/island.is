import React from 'react'
import { Box } from '@island.is/island-ui/core'
import HeaderRow from './HeaderRow'
import Column from './Column'
import Row from './Row'
import { RegistrationInfo } from '@island.is/api/schema'
import { messages } from '../../lib/messages'

interface PropTypes {
  data: RegistrationInfo
}

const RegistrationInfoItem = ({ data }: PropTypes) => {
  return (
    <Box marginBottom={4}>
      <HeaderRow>{messages.regTitle}</HeaderRow>
      <Row>
        <Column
          label={messages.firstReg}
          value={
            data.firstRegistrationDate &&
            new Date(data.firstRegistrationDate).toLocaleDateString()
          }
        />
        <Column
          label={messages.preReg}
          value={
            data.preRegistrationDate &&
            new Date(data.preRegistrationDate).toLocaleDateString()
          }
        />
      </Row>
      <Row>
        <Column
          label={messages.newReg}
          value={
            data.newRegistrationDate &&
            new Date(data.newRegistrationDate).toLocaleDateString()
          }
        />
        <Column label={messages.vehGroup} value={data.vehicleGroup} />
      </Row>
      <Row>
        <Column label={messages.color} value={data.color} />

        <Column label={messages.regType} value={data.reggroup} />
      </Row>
      <Row>
        <Column label={messages.passengers} value={data.passengers} />
        <Column label={messages.useGroup} value={data.useGroup} />
      </Row>
      <Row>
        <Column
          label={messages.driversPassengers}
          value={data.driversPassengers ? 'Já' : 'Nei'}
        />
        <Column
          label={messages.standingPassengers}
          value={data.standingPassengers}
        />
      </Row>
    </Box>
  )
}

export default RegistrationInfoItem
