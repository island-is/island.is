import { Case } from '@island.is/judicial-system/types'
import React from 'react'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  isLoading: boolean
}

const CourtRecordForm: React.FC<Props> = (props) => {
  return <p>sjdknfjksnd</p>
}

export default CourtRecordForm
