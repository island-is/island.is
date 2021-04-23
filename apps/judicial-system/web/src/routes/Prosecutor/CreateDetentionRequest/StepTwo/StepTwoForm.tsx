import React from 'react'
import { Case } from '@island.is/judicial-system/types'

interface Props {
  theCase: Case
}

const StepTwoForm: React.FC<Props> = (props) => {
  const { theCase } = props
  return <p>StepTwoForm</p>
}

export default StepTwoForm
