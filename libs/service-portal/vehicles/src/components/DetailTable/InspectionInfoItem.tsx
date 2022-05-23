import React from 'react'
import HeaderRow from './HeaderRow'
import Column from './Column'
import Row from './Row'
import { Box } from '@island.is/island-ui/core'
import { VehiclesInspectionInfo } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'
import { amountFormat } from '@island.is/service-portal/core'

interface PropTypes {
  data: VehiclesInspectionInfo
}

const InspectionInfoItem = ({ data }: PropTypes) => {
  const { formatMessage } = useLocale()

  console.log('data.insuranceStatus', data.insuranceStatus)
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
        <Column
          label={messages.vehicleFee}
          value={
            data.carTax && data.carTax > 0 ? amountFormat(data.carTax) : ''
          }
        />

        <Column
          label={messages.insured}
          value={
            data.insuranceStatus === true
              ? formatMessage(messages.yes)
              : data.insuranceStatus === false
              ? formatMessage(messages.no)
              : ''
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
        <Column
          label={messages.mortages}
          value={
            data.encumbrances && data.encumbrances > 0
              ? amountFormat(data.encumbrances)
              : ''
          }
        />
        <Column
          label={messages.negligence}
          value={
            data.inspectionFine && data.inspectionFine > 0
              ? amountFormat(data.inspectionFine)
              : ''
          }
        />
      </Row>
      {/* <Row>
        <Column label={messages.plateLocation} value={null} />
      </Row> */}
    </Box>
  )
}

export default InspectionInfoItem
