import React from 'react'

import { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'
import { Box, Text } from '@island.is/island-ui/core'
import { formatDOB } from '@island.is/judicial-system/formatters'

interface Props {
  defendants: Defendant[]
}

const DefenderInfo: React.FC<Props> = (props) => {
  const { defendants } = props

  return (
    <>
      <Box component="span" display="block">
        {defendants[0].name}
      </Box>
      <Text as="span" variant="small">
        {defendants.length === 1
          ? formatDOB(defendants[0].nationalId, defendants[0].noNationalId)
          : `+ ${defendants.length - 1}`}
      </Text>
    </>
  )
}

export default DefenderInfo
