import type { FC } from 'react'
import { useState } from 'react'
import type { IntlShape } from 'react-intl'
import { useIntl } from 'react-intl'

import { Box, Input } from '@island.is/island-ui/core'
import { Modal } from '@island.is/judicial-system-web/src/components'
import type { Case } from '@island.is/judicial-system-web/src/graphql/schema'
import { RequestSharedWithDefender } from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './CaseResubmitModal.strings'

interface Props {
  workingCase: Case
  isLoading: boolean
  onClose: () => void
  onContinue: (explanation: string) => void
}
export const getCaseResubmittedText = (
  formatMessage: IntlShape['formatMessage'],
  workingCase: Case,
) => {
  return formatMessage(strings.text, {
    requestSharedWithDefender:
      (workingCase.requestSharedWithDefender ===
        RequestSharedWithDefender.COURT_DATE &&
        Boolean(workingCase.arraignmentDate?.date)) ||
      workingCase.requestSharedWithDefender ===
        RequestSharedWithDefender.READY_FOR_COURT,
  })
}

const CaseResubmitModal: FC<Props> = ({
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
      buttons={[
        {
          text: formatMessage(strings.secondaryButtonText),
          onClick: onClose,
          variant: 'ghost',
        },
        {
          text: formatMessage(strings.primaryButtonText),
          onClick: () => {
            if (explanation) {
              onContinue(explanation)
            }
          },
          isLoading: isLoading,
          isDisabled: !explanation,
        },
      ]}
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
