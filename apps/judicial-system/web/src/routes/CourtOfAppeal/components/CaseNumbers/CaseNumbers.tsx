import { FC, useContext } from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { FormContext } from '@island.is/judicial-system-web/src/components'

const CaseNumbers: FC = () => {
  const { workingCase } = useContext(FormContext)

  if (!workingCase.appealCaseNumber) {
    return (
      <Text as="h3" variant="default" fontWeight="semiBold" marginBottom={1}>
        Málsnr. Héraðsdóms {workingCase.courtCaseNumber}
      </Text>
    )
  }

  return (
    <Box marginBottom={7}>
      <Text as="h2" variant="h2">
        Mál nr. {workingCase.appealCaseNumber}
      </Text>
      <Text as="h3" variant="default" fontWeight="semiBold">
        Málsnr. Héraðsdóms {workingCase.courtCaseNumber}
      </Text>
    </Box>
  )
}

export default CaseNumbers
