import type { FC } from 'react'

import { AlertMessage } from '@island.is/island-ui/core'
import ExplanationText from '@island.is/judicial-system-web/src/components/ExplanationText/ExplanationText'

import { caseResentExplanation as strings } from './CaseResentExplanation.strings'

interface Props {
  explanation: string
}

const CaseResentExplanation: FC<Props> = (props) => {
  const { explanation } = props
  return (
    <AlertMessage
      title={strings.title}
      message={<ExplanationText explanation={explanation} variant="small" />}
      type="warning"
    />
  )
}

export default CaseResentExplanation
