import { Box, Text } from '@island.is/island-ui/core'
import { Case } from 'libs/judicial-system/types/src'
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
