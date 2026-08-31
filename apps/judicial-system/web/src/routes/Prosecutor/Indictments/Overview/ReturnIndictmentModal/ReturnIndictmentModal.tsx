import type { Dispatch, FC, SetStateAction } from 'react'
import { useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, Input, toast } from '@island.is/island-ui/core'
import { errors } from '@island.is/judicial-system-web/messages'
import { Modal } from '@island.is/judicial-system-web/src/components'
import type { Case } from '@island.is/judicial-system-web/src/graphql/schema'
import { CaseTransition } from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'

interface Props {
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
  onClose: () => void
  onComplete: () => void
}

const ReturnIndictmentModal: FC<Props> = ({
  workingCase,
  setWorkingCase,
  onClose,
  onComplete,
}) => {
  const { formatMessage } = useIntl()
  const { updateCase, transitionCase } = useCase()
  const [explanation, setExplanation] = useState<string>()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const trimmedExplanation = explanation?.trim() ?? ''

  const isExplanationValid = validate([[trimmedExplanation, ['empty']]]).isValid

  const handleExplanationChange = (value: string) => {
    const { isValid } = validate([[value.trim(), ['empty']]])

    setExplanation(value)
    if (isValid) {
      setErrorMessage('')
    }
  }

  const handleExplanationBlur = (value: string) => {
    const trimmed = value.trim()
    const { isValid, errorMessage: msg } = validate([[trimmed, ['empty']]])

    if (isValid) {
      setExplanation(trimmed)
    } else {
      setErrorMessage(msg)
    }
  }

  const handleReturnIndictment = async () => {
    if (!isExplanationValid || isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      const updatedCase = await updateCase(workingCase.id, {
        indictmentReviewReturnedExplanation: trimmedExplanation,
      })

      if (!updatedCase) {
        return
      }

      const transitioned = await transitionCase(
        workingCase.id,
        CaseTransition.DENY_REVIEW,
        setWorkingCase,
      )

      if (!transitioned) {
        toast.error(formatMessage(errors.transitionCase))
        return
      }

      onComplete()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      title="Senda ákæru til baka"
      text="Skráðu athugasemdir sem ákærandi fær sendar."
      onClose={onClose}
      buttons={[
        {
          text: 'Hætta við',
          onClick: onClose,
          variant: 'ghost',
        },
        {
          text: 'Senda ákæru til baka',
          onClick: handleReturnIndictment,
          isLoading: isSubmitting,
          isDisabled: !isExplanationValid,
        },
      ]}
    >
      <Box marginBottom={5}>
        <Input
          name="indictmentReviewReturnedExplanation"
          label="Athugasemdir"
          placeholder="Skráðu athugasemdir hér"
          onChange={(event) => handleExplanationChange(event.target.value)}
          onBlur={(event) => handleExplanationBlur(event.target.value)}
          hasError={errorMessage !== ''}
          errorMessage={errorMessage}
          textarea
          rows={9}
          required
        />
      </Box>
    </Modal>
  )
}

export default ReturnIndictmentModal
