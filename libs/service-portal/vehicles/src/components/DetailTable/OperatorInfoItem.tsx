import React from 'react'
import HeaderRow from './HeaderRow'
import Column from './Column'
import Row from './Row'
import { Box } from '@island.is/island-ui/core'
import { Operator } from '@island.is/api/schema'
import { messages } from '../../lib/messages'

interface PropTypes {
  data: Operator
}

const OperatorInfoItem = ({ data }: PropTypes) => {
  return (
    <Box marginBottom={4}>
      <HeaderRow>{messages.operator}</HeaderRow>
      <Row>
        <Column label={messages.name} value={data.name} />
        <Column label={messages.nationalId} value={data.persidno} />
      </Row>
      <Row>
        <Column label={messages.address} value={data.address} />
        <Column label={messages.postalCode} value={data.postalcode} />
      </Row>
      <Row>
        <Column label={messages.city} value={data.city} />

        <Column
          label={messages.dateFrom}
          value={
            data.startDate && new Date(data.startDate).toLocaleDateString()
          }
        />
      </Row>
    </Box>
  )
}

export default OperatorInfoItem
