import { useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, Input } from '@island.is/island-ui/core'
import { isCourtOfAppealsUser } from '@island.is/judicial-system/types'
import {
  FormContext,
  Modal,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'

import { strings } from './RulingModifiedModal.strings'

interface Props {
  onCancel: () => void
  onContinue: () => void
  continueDisabled?: boolean
}

const RulingModifiedModal: React.FC<React.PropsWithChildren<Props>> = ({
  onCancel,
  onContinue,
  continueDisabled = false,
}) => {
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const { workingCase } = useContext(FormContext)
  const { updateCase } = useCase()

  const [explanation, setExplanation] = useState(
    formatMessage(
      isCourtOfAppealsUser(user)
        ? strings.appealRulingAutofill
        : strings.rulingAutofill,
    ),
  )
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleContinue = () => {
    updateCase(
      workingCase.id,
      isCourtOfAppealsUser(user)
        ? { appealRulingModifiedHistory: explanation }
        : { rulingModifiedHistory: explanation },
    )

    onContinue()
  }

  const handleExplanationChange = (explanation: string) => {
    const { isValid } = validate([[explanation, ['empty']]])

    setExplanation(explanation)

    if (isValid) {
      setErrorMessage('')
    }
  }

  const handleExplanationBlur = (explanation: string) => {
    const { isValid, errorMessage } = validate([[explanation, ['empty']]])

    if (isValid) {
      setExplanation(explanation)
    } else {
      setErrorMessage(errorMessage)
    }
  }

  return (
    <Modal
      title={formatMessage(strings.title)}
      text={formatMessage(
        isCourtOfAppealsUser(user)
          ? strings.appealRulingText
          : strings.rulingText,
      )}
      primaryButtonText={formatMessage(
        isCourtOfAppealsUser(user)
          ? strings.appealRulingContinue
          : strings.rulingContinue,
      )}
      onPrimaryButtonClick={handleContinue}
      isPrimaryButtonDisabled={errorMessage !== ''}
      isPrimaryButtonLoading={continueDisabled}
      secondaryButtonText={formatMessage(strings.cancel)}
      onSecondaryButtonClick={onCancel}
    >
      <Box marginBottom={5}>
        <Input
          name="reason"
          label={formatMessage(strings.label)}
          value={explanation}
          onChange={(event) => {
            handleExplanationChange(event.target.value)
          }}
          onBlur={(event) => handleExplanationBlur(event.target.value)}
          hasError={errorMessage !== ''}
          errorMessage={errorMessage}
          textarea
          rows={9}
          required
          autoComplete="off"
        />
      </Box>
    </Modal>
  )
}

export default RulingModifiedModal
