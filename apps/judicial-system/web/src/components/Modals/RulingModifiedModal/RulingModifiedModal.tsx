import { FC, useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, Input } from '@island.is/island-ui/core'
import {
  FormContext,
  Modal,
} from '@island.is/judicial-system-web/src/components'
import { Case } from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'

import { strings } from './RulingModifiedModal.strings'

interface Props {
  onCancel: () => void
  onContinue: () => void
  continueDisabled?: boolean
  description: string
  defaultExplanation: string
  fieldToModify: keyof Pick<
    Case,
    'rulingModifiedHistory' | 'appealRulingModifiedHistory'
  >
}

const RulingModifiedModal: FC<Props> = ({
  onCancel,
  onContinue,
  continueDisabled = false,
  description,
  defaultExplanation,
  fieldToModify,
}) => {
  const { formatMessage } = useIntl()
  const { workingCase } = useContext(FormContext)
  const { updateCase } = useCase()

  const [explanation, setExplanation] = useState(defaultExplanation)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleContinue = async () => {
    const caseUpdate = await updateCase(workingCase.id, {
      [fieldToModify]: explanation,
    })

    if (caseUpdate) {
      onContinue()
    }
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
      text={description}
      primaryButton={{
        text: formatMessage(strings.continue),
        onClick: handleContinue,
        isLoading: continueDisabled,
        isDisabled: errorMessage !== '',
      }}
      secondaryButton={{
        text: formatMessage(strings.cancel),
        onClick: onCancel,
      }}
    >
      <Box marginBottom={5}>
        <Input
          id="reason"
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
