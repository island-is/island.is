import React from 'react'
import HeaderRow from './HeaderRow'
import Column from './Column'
import Row from './Row'
import { Box } from '@island.is/island-ui/core'
import { CurrentOwnerInfo } from '@island.is/api/schema'
import { messages } from '../../lib/messages'

interface PropTypes {
  data: CurrentOwnerInfo
}

const CoOwnerInfoItem = ({ data }: PropTypes) => {
  return (
    <Box marginBottom={4}>
      <HeaderRow>{messages.coOwner}</HeaderRow>
      <Row>
        <Column label={messages.name} value={data.owner} />
        <Column label={messages.nationalId} value={data.persidno} />
      </Row>
      <Row>
        <Column label={messages.address} value={data.address} />
        <Column label={messages.postalCode} value={data.postalcode} />
      </Row>
      <Row>
        <Column label={messages.city} value={data.city} />
      </Row>
    </Box>
  )
}

export default CoOwnerInfoItem
