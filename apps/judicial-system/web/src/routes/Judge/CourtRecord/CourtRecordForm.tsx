import React from 'react'
import { Case } from '@island.is/judicial-system/types'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  isLoading: boolean
}

const CourtRecordForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, isLoading } = props

  return <>sjdhfjnjksdnf </>
}

export default CourtRecordForm
