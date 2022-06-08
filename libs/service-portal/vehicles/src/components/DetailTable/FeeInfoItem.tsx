import React from 'react'
import HeaderRow from './HeaderRow'
import Column from './Column'
import Row from './Row'
import { Box } from '@island.is/island-ui/core'
import { VehiclesInspectionInfo } from '@island.is/api/schema'
// import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'
import { amountFormat } from '@island.is/service-portal/core'
import isNumber from 'lodash/isNumber'

interface PropTypes {
  data: VehiclesInspectionInfo
}

const FeeInfoItem = ({ data }: PropTypes) => {
  // const { formatMessage } = useLocale()

  return (
    <Box marginBottom={4}>
      <HeaderRow>{messages.feeTitle}</HeaderRow>
      <Row>
        <Column
          label={messages.mortages}
          value={
            isNumber(data?.mortages) ? amountFormat(Number(data.mortages)) : ''
          }
        />

        {/* <Column
          label={messages.insured}
          value={
            data.insuranceStatus === true
              ? formatMessage(messages.yes)
              : data.insuranceStatus === false
              ? formatMessage(messages.no)
              : ''
          }
        /> */}
        <Column
          label={messages.negligence}
          value={
            isNumber(data?.inspectionFine)
              ? amountFormat(Number(data.inspectionFine))
              : ''
          }
        />
      </Row>
      <Row>
        <Column
          label={messages.vehicleFee}
          value={
            isNumber(data?.carTax) ? amountFormat(Number(data.carTax)) : ''
          }
        />
      </Row>
    </Box>
  )
}

export default FeeInfoItem
