import React from 'react'

import { Box } from '@island.is/island-ui/core'
import { FormContentContainer } from '@island.is/judicial-system-web/src/components'
import { Case } from '@island.is/judicial-system/types'

interface Props {
  workingCase: Case
}

const CaseOverviewForm: React.FC<Props> = (props) => {
  const { workingCase } = props

  return (
    <FormContentContainer>
      <Box marginBottom={5}></Box>
    </FormContentContainer>
  )
}

export default CaseOverviewForm
