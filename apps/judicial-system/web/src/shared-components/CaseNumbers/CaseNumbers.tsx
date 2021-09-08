import { Box, Text } from '@island.is/island-ui/core'
import type { Case } from '@island.is/judicial-system/types'
import React from 'react'

interface Props {
  workingCase: Case
}

const CaseNumbers: React.FC<Props> = ({ workingCase }: Props) => {
  return (
    <Box display="flex">
      <Box marginRight={5}>
        <Text fontWeight="semiBold">{`LÖKE málsnr. ${workingCase.policeCaseNumber}`}</Text>
      </Box>
      {workingCase.parentCase && (
        <Text fontWeight="semiBold">{`Fyrra málsnr. Héraðsdóms ${workingCase.parentCase.courtCaseNumber}`}</Text>
      )}
    </Box>
  )
}

export default CaseNumbers
