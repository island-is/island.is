import React from 'react'
import { Box, Text, Input } from '@island.is/island-ui/core'
import { Case } from '@island.is/judicial-system/types'
import { Decision } from '@island.is/judicial-system-web/src/shared-components'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
}

const ConclusionDraft: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase } = props
  return (
    <>
      <Box marginBottom={3}>
        <Text variant="h3">Úrskurður</Text>
      </Box>
      <Box marginBottom={3}>
        <Decision workingCase={workingCase} setWorkingCase={setWorkingCase} />
      </Box>
    </>
  )
}

export default ConclusionDraft
