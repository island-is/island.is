import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, Input } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  Modal,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  Case,
  CaseTransition,
} from '@island.is/judicial-system-web/src/graphql/schema'
import useCase from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'

import { strings } from './ResendIndictmentCaseModal.strings'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  onClose: () => void
  onComplete: () => void
}

const ResendIndictmentModal: React.FC<React.PropsWithChildren<Props>> = ({
  workingCase,
  setWorkingCase,
  onClose,
  onComplete,
}) => {
  const { formatMessage } = useIntl()
  const { updateCase, transitionCase } = useCase()
  const { user } = useContext(UserContext)

  const [indictmentResentExplanation, setIndictmentResentExplanation] =
    useState<string>()
  const [
    indictmentResentExplanationErrorMessage,
    setIndictmentResentExplanationErrorMessage,
  ] = useState<string>('')

  const handleIndictmentResentExplanationChange = (reason: string) => {
    const { isValid } = validate([[reason, ['empty']]])

    setIndictmentResentExplanation(reason)
    if (isValid) {
      setIndictmentResentExplanationErrorMessage('')
    }
  }

  const handleIndictmentResentExplanationBlur = (reason: string) => {
    const { isValid, errorMessage } = validate([[reason, ['empty']]])

    if (isValid) {
      setIndictmentResentExplanation(reason)
    } else {
      setIndictmentResentExplanationErrorMessage(errorMessage)
    }
  }

  const handleDenyIndictmentCase = async () => {
    if (!indictmentResentExplanation) {
      return
    }

    const now = new Date()
    const prependedResentExplanation = `${formatMessage(
      strings.prependedResentExplanation,
      {
        date: formatDate(now, 'PPPp')?.replace('dagur,', 'daginn') ?? '',
        name: user?.name,
        courtName: workingCase.court?.name,
      },
    )}\n${indictmentResentExplanation}`

    const updatedCase = await updateCase(workingCase.id, {
      indictmentDeniedExplanation: prependedResentExplanation,
    })

    if (!updatedCase) {
      return
    }

    const transitioned = await transitionCase(
      workingCase.id,
      CaseTransition.RESEND_INDICTMENT,
      setWorkingCase,
    )

    if (transitioned) {
      onComplete()
    }
  }

  return (
    <Modal
      title={formatMessage(strings.resendModalTitle)}
      text={formatMessage(strings.resendModalText)}
      onClose={() => onClose()}
      primaryButtonText={formatMessage(strings.resendModalPrimaryButtonText)}
      secondaryButtonText={formatMessage(
        strings.resendModalSecondaryButtonText,
      )}
      onPrimaryButtonClick={handleDenyIndictmentCase}
      onSecondaryButtonClick={onClose}
    >
      <Box marginBottom={5}>
        <Input
          name="indictmentResentExplanation"
          label={formatMessage(strings.resendExplanationLabel)}
          placeholder={formatMessage(strings.resendExplanationLabel)}
          onChange={(event) => {
            handleIndictmentResentExplanationChange(event.target.value)
          }}
          onBlur={(event) => {
            handleIndictmentResentExplanationBlur(event.target.value)
          }}
          hasError={indictmentResentExplanationErrorMessage !== ''}
          errorMessage={indictmentResentExplanationErrorMessage}
          textarea
          rows={9}
          required
        />
      </Box>
    </Modal>
  )
}

export default ResendIndictmentModal
