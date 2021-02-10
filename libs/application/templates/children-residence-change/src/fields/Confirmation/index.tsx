import React from 'react'
import { Box } from '@island.is/island-ui/core'
import { confirmation } from '../../lib/messages'
import { DescriptionText } from '../components'

const Confirmation = () => {
  return (
    <Box marginTop={3}>
      <DescriptionText
        text={confirmation.general.description}
        format={{ applicationNumber: '12345' }}
      />
    </Box>
  )
}

export default Confirmation
