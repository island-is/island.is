import React from 'react'
import HeaderRow from './HeaderRow'
import Column from './Column'
import Row from './Row'
import { Box } from '@island.is/island-ui/core'
import { InspectionInfo } from '@island.is/api/schema'
import { messages } from '../../lib/messages'

interface PropTypes {
  data: InspectionInfo
}

const InspectionInfoItem = ({ data }: PropTypes) => {
  return (
    <Box marginBottom={4}>
      <HeaderRow>{messages.inspectionTitle}</HeaderRow>
      <Row>
        <Column label={messages.inspectionType} value={data.type} />

        <Column
          label={messages.date}
          value={data.date && new Date(data.date).toLocaleDateString()}
        />
      </Row>
      <Row>
        <Column label={messages.result} value={data.result} />
        <Column label={messages.plateStatus} value={data.plateStatus} />
      </Row>
      <Row>
        <Column label={messages.vehicleFee} value={null} />

        <Column
          label={messages.insured}
          value={
            null
            // ? {
            //     id: 'sp.vehicles:insp-insured-yes',
            //     defaultMessage: 'Já',
            //   })
            // : {
            //     id: 'sp.vehicles:insp-insured-no',
            //     defaultMessage: 'Nei',
            //   })
          }
        />
      </Row>
      <Row>
        <Column
          label={messages.nextInspection}
          value={
            data.nextInspectionDate &&
            new Date(data.nextInspectionDate).toLocaleDateString()
          }
        />
        <Column
          label={messages.lastInspection}
          value={
            data.lastInspectionDate &&
            new Date(data.lastInspectionDate).toLocaleDateString()
          }
        />
      </Row>
      <Row>
        <Column label={messages.mortages} value={null} />
        <Column label={messages.negligence} value={null} />
      </Row>
      <Row>
        <Column label={messages.plateLocation} value={null} />
      </Row>
    </Box>
  )
}

export default InspectionInfoItem
