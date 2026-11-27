import type { FC } from 'react'
import { useContext } from 'react'

import Conclusion from '@island.is/judicial-system-web/src/components/Conclusion/Conclusion'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'

import { getVerdictAppealConclusion } from './VerdictAppealConclusion.logic'

const VerdictAppealConclusion: FC = () => {
  const { workingCase } = useContext(FormContext)
  const conclusion = getVerdictAppealConclusion(workingCase)

  if (!conclusion) {
    return null
  }

  return (
    <Conclusion title={conclusion.title} conclusionText={conclusion.text} />
  )
}

export default VerdictAppealConclusion
