import React from 'react'
import { Box } from '@island.is/island-ui/core'
import { DescriptionText } from '@island.is/application/templates/family-matters-core/components'
import { rejected } from '../../lib/messages'

const Rejected = () => {
  return (
    <Box marginTop={3} paddingBottom={5}>
      <DescriptionText text={rejected.general.description} />
    </Box>
  )
}

export default Rejected
