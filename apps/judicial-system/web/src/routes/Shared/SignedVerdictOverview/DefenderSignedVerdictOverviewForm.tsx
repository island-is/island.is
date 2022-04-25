import React from 'react'

import { FormContentContainer } from '@island.is/judicial-system-web/src/components'
import { Case } from '@island.is/judicial-system/types'

interface Props {
  workingCase: Case
}

const DefenderSignedVerdictOverviewForm: React.FC<Props> = (props) => {
  const { workingCase } = props

  console.log(workingCase)

  return <FormContentContainer></FormContentContainer>
}

export default DefenderSignedVerdictOverviewForm
