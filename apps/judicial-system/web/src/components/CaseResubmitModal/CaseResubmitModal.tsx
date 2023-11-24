import React, { useState } from 'react'
import { IntlShape, useIntl } from 'react-intl'

import { Box, Input } from '@island.is/island-ui/core'
import { caseResubmitModal as m } from '@island.is/judicial-system-web/messages'
import { RequestSharedWithDefender } from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'

import { Modal } from '..'

interface Props {
  workingCase: Case
  isLoading: boolean
  onClose: () => void
  onContinue: (explanation: string) => void
}
export function getCaseResubmittedText(
  formatMessage: IntlShape['formatMessage'],
  workingCase: Case,
) {
  return formatMessage(m.text, {
    requestSharedWithDefender:
      (workingCase.requestSharedWithDefender ===
        RequestSharedWithDefender.COURT_DATE &&
        workingCase.courtDate) ||
      workingCase.requestSharedWithDefender ===
        RequestSharedWithDefender.READY_FOR_COURT,
  })
}

const CaseResubmitModal: React.FC<React.PropsWithChildren<Props>> = ({
  workingCase,
  isLoading,
  onClose,
  onContinue,
}) => {
  const { formatMessage } = useIntl()
  const [explanation, setExplanation] = useState('')
  return (
    <Modal
      title={formatMessage(m.heading)}
      text={getCaseResubmittedText(formatMessage, workingCase)}
      onClose={onClose}
      primaryButtonText={formatMessage(m.primaryButtonText)}
      secondaryButtonText={formatMessage(m.secondaryButtonText)}
      onSecondaryButtonClick={onClose}
      onPrimaryButtonClick={() => {
        if (explanation) {
          onContinue(explanation)
        }
      }}
      isPrimaryButtonLoading={isLoading}
      isPrimaryButtonDisabled={!explanation}
    >
      <Box marginBottom={10}>
        <Input
          name="caseResentExplanation"
          label={formatMessage(m.input.label)}
          placeholder={formatMessage(m.input.placeholder)}
          onChange={(evt) => setExplanation(evt.target.value)}
          textarea
          rows={7}
        />
      </Box>
    </Modal>
  )
}

export default CaseResubmitModal
