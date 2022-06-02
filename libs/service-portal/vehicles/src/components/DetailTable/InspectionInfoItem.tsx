import React from 'react'
import HeaderRow from './HeaderRow'
import Column from './Column'
import Row from './Row'
import { Box } from '@island.is/island-ui/core'
import { VehiclesInspectionInfo } from '@island.is/api/schema'
import { messages } from '../../lib/messages'

interface PropTypes {
  data: VehiclesInspectionInfo
}

const InspectionInfoItem = ({ data }: PropTypes) => {
  return (
    <Box marginBottom={4}>
      <HeaderRow>{messages.inspectionTitle}</HeaderRow>
      <Row>
        <Column label={messages.inspectionType} value={data.type} />
        <Column label={messages.result} value={data.result} />
      </Row>
      <Row>
        <Column
          label={messages.date}
          value={data.date && new Date(data.date).toLocaleDateString()}
        />
        <Column
          label={messages.nextInspection}
          value={
            data.nextInspectionDate &&
            new Date(data.nextInspectionDate).toLocaleDateString()
          }
        />
      </Row>
    </Box>
  )
}

export default InspectionInfoItem
