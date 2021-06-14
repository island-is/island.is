import React from 'react'
import { Case } from '@island.is/judicial-system/types'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  isLoading: boolean
}

const RulingStepOneForm: React.FC<Props> = (props) => {
  return <p>sjdknfjksnd</p>
}

export default RulingStepOneForm
