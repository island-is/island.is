import React, { useState } from 'react'
import { IntlShape, useIntl } from 'react-intl'

import { Box, Input } from '@island.is/island-ui/core'
import { RequestSharedWithDefender } from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'

import { Modal } from '..'
import { strings } from './CaseResubmitModal.strings'

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
  return formatMessage(strings.text, {
    requestSharedWithDefender:
      (workingCase.requestSharedWithDefender ===
        RequestSharedWithDefender.COURT_DATE &&
        Boolean(workingCase.courtDate)) ||
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
      title={formatMessage(strings.heading)}
      text={getCaseResubmittedText(formatMessage, workingCase)}
      onClose={onClose}
      primaryButtonText={formatMessage(strings.primaryButtonText)}
      secondaryButtonText={formatMessage(strings.secondaryButtonText)}
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
          label={formatMessage(strings.inputLabel)}
          placeholder={formatMessage(strings.inputPlaceholder)}
          onChange={(evt) => setExplanation(evt.target.value)}
          textarea
          rows={7}
        />
      </Box>
    </Modal>
  )
}

export default CaseResubmitModal
