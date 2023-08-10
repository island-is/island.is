import React from 'react'
import { useIntl } from 'react-intl'

import { AlertMessage } from '@island.is/island-ui/core'

import MarkdownWrapper from '../MarkdownWrapper/MarkdownWrapper'
import { caseResentExplanation as strings } from './CaseResentExplanation.strings'

interface Props {
  explanation: string
}

const CaseResentExplanation: React.FC<React.PropsWithChildren<Props>> = (
  props,
) => {
  const { explanation } = props
  const { formatMessage } = useIntl()

  return (
    <AlertMessage
      title={formatMessage(strings.title)}
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
