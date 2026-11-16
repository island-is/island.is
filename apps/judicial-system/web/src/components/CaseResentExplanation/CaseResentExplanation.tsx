import type { FC } from 'react'

import { AlertMessage } from '@island.is/island-ui/core'
import MarkdownWrapper from '@island.is/judicial-system-web/src/components/MarkdownWrapper/MarkdownWrapper'

import { caseResentExplanation as strings } from './CaseResentExplanation.strings'

interface Props {
  explanation: string
}

const CaseResentExplanation: FC<Props> = (props) => {
  const { explanation } = props
  return (
    <AlertMessage
      title={strings.title}
      message={
        <MarkdownWrapper
          markdown={explanation}
          textProps={{ variant: 'small' }}
        />
      }
      type="warning"
    />
  )
}

export default CaseResentExplanation
