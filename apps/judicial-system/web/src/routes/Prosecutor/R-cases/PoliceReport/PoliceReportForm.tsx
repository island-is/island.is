import { Case } from '@island.is/judicial-system/types'
import React from 'react'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
}

const PoliceReportForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase } = props
  return <p>skdlnjsdf</p>
}

export default PoliceReportForm
