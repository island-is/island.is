import type { FC } from 'react'
import { useState } from 'react'
import type { IntlShape } from 'react-intl'
import { useIntl } from 'react-intl'

import { Box, Input } from '@island.is/island-ui/core'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import { Modal } from '@island.is/judicial-system-web/src/components'
import { RequestSharedWithDefender } from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './CaseResubmitModal.strings'

interface Props {
  workingCase: WorkingCase
  isLoading: boolean
  onClose: () => void
  onContinue: (explanation: string) => void
}
export const getCaseResubmittedText = (
  formatMessage: IntlShape['formatMessage'],
  workingCase: WorkingCase,
) => {
  const requestSharedWithDefender = (workingCase.defendants ?? []).some(
    (defendant) =>
      defendant.requestSharedWithDefender ===
        RequestSharedWithDefender.READY_FOR_COURT ||
      (defendant.requestSharedWithDefender ===
        RequestSharedWithDefender.COURT_DATE &&
        Boolean(workingCase.arraignmentDate?.date)),
  )

  return formatMessage({ id: strings.text, defaultMessage: strings.text }, { requestSharedWithDefender })
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
      title={strings.heading}
      text={getCaseResubmittedText(formatMessage, workingCase)}
      onClose={onClose}
      buttons={[
        {
          text: strings.secondaryButtonText,
          onClick: onClose,
          variant: 'ghost',
        },
        {
          text: strings.primaryButtonText,
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
          label={strings.inputLabel}
          placeholder={strings.inputPlaceholder}
          onChange={(evt) => setExplanation(evt.target.value)}
          textarea
          rows={7}
        />
      </Box>
    </Modal>
  )
}

export default CaseResubmitModal
