import React from 'react'
import HeaderRow from './HeaderRow'
import Column from './Column'
import Row from './Row'
import { Box } from '@island.is/island-ui/core'
import { VehiclesBasicInfo } from '@island.is/api/schema'
import { messages } from '../../lib/messages'
interface PropTypes {
  data: VehiclesBasicInfo
}

const BaseInfoItem = ({ data }: PropTypes) => {
  return (
    <Box marginBottom={4}>
      <HeaderRow>{messages.baseInfoTitle}</HeaderRow>
      <Row>
        <Column label={messages.type} value={data.model || ''} />
        <Column label={messages.regno} value={data.regno || ''} />
      </Row>
      <Row>
        <Column label={messages.subType} value={data.subModel || ''} />
        <Column label={messages.permno} value={data.permno || ''} />
      </Row>
      <Row>
        <Column label={messages.verno} value={data.verno || ''} />
        <Column label={messages.year} value={data.year || ''} />
      </Row>
      <Row>
        <Column label={messages.country} value={data.country || ''} />
        <Column label={messages.preRegYear} value={data.preregDateYear || ''} />
      </Row>
      <Row>
        <Column label={messages.preCountry} value={data.formerCountry || ''} />
        <Column label={messages.importStatus} value={data.importStatus || ''} />
      </Row>
    </Box>
  )
}

export default BaseInfoItem
