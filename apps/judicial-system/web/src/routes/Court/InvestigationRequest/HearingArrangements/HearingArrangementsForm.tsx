import { Case } from '@island.is/judicial-system/types'
import React from 'react'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  isLoading: boolean
}

const HearingArrangementsForm: React.FC<Props> = (props) => {
  return <p>sjdknfjksnd</p>
}

export default HearingArrangementsForm
