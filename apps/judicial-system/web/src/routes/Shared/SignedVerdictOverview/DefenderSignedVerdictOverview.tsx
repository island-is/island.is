import React, { useContext } from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'

export const DefenderSignedVerdictOverview: React.FC = () => {
  const { workingCase } = useContext(FormContext)

  console.log(workingCase)

  return (
    <Box>
      <Text>Defender</Text>
    </Box>
  )
}
