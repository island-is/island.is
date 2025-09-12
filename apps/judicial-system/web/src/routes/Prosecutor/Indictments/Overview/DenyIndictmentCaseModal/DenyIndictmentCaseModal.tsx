import { Dispatch, FC, SetStateAction, useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, Input } from '@island.is/island-ui/core'
import { Modal } from '@island.is/judicial-system-web/src/components'
import {
  Case,
  CaseTransition,
} from '@island.is/judicial-system-web/src/graphql/schema'
import useCase from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'

import { strings } from './DenyIndictmentCaseModal.strings'

interface Props {
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
  onClose: () => void
  onComplete: () => void
}

const DenyIndictmentCaseModal: FC<Props> = ({
  workingCase,
  setWorkingCase,
  onClose,
  onComplete,
}) => {
  const { formatMessage } = useIntl()
  const { updateCase, transitionCase } = useCase()
  const [indictmentDeniedExplanation, setIndictmentDeniedExplanation] =
    useState<string>()
  const [
    indictmentDeniedExplanationErrorMessage,
    setIndictmentDeniedExplanationErrorMessage,
  ] = useState<string>('')

  const handleIndictmentDeniedExplanationChange = (reason: string) => {
    const { isValid } = validate([[reason, ['empty']]])

    setIndictmentDeniedExplanation(reason)
    if (isValid) {
      setIndictmentDeniedExplanationErrorMessage('')
    }
  }

  const handleIndictmentDeniedExplanationBlur = (reason: string) => {
    const { isValid, errorMessage } = validate([[reason, ['empty']]])

    if (isValid) {
      setIndictmentDeniedExplanation(reason)
    } else {
      setIndictmentDeniedExplanationErrorMessage(errorMessage)
    }
  }

  const handleDenyIndictmentCase = async () => {
    if (!indictmentDeniedExplanation) {
      return
    }

    const updatedCase = await updateCase(workingCase.id, {
      indictmentDeniedExplanation: indictmentDeniedExplanation,
    })

    if (!updatedCase) {
      return
    }

    const transitioned = await transitionCase(
      workingCase.id,
      CaseTransition.DENY_INDICTMENT,
      setWorkingCase,
    )

    if (transitioned) {
      onComplete()
    }
  }

  return (
    <Modal
      title={formatMessage(strings.title)}
      text={formatMessage(strings.text)}
      onClose={() => onClose()}
      primaryButton={{
        text: formatMessage(strings.denyAndReturnToProsecutor),
        onClick: handleDenyIndictmentCase,
      }}
      secondaryButton={{
        text: formatMessage(strings.stopModal),
        onClick: onClose,
      }}
    >
      <Box marginBottom={5}>
        <Input
          name="indictmentDeniedExplanation"
          label={formatMessage(strings.explanationLabel)}
          placeholder={formatMessage(strings.explanationPlaceholder)}
          onChange={(event) => {
            handleIndictmentDeniedExplanationChange(event.target.value)
          }}
          onBlur={(event) => {
            handleIndictmentDeniedExplanationBlur(event.target.value)
          }}
          hasError={indictmentDeniedExplanationErrorMessage !== ''}
          errorMessage={indictmentDeniedExplanationErrorMessage}
          textarea
          rows={9}
          required
        />
      </Box>
    </Modal>
  )
}

export default DenyIndictmentCaseModal
