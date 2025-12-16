import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, AlertMessage } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { YES } from '@island.is/application/core'
import React from 'react'

const PARTICIPANT_VALIDATION_FIELD_ID = 'participantValidation'

export const ParticipantValidation: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ setBeforeSubmitCallback, errors }) => {
  const { formatMessage } = useLocale()
  const { watch, setError, clearErrors } = useFormContext()

  const userIsParticipating = watch('userIsParticipating')
  const participantList = watch('participantList')

  // Check if user is participating (defaults to YES if undefined)
  const isUserParticipating =
    userIsParticipating === undefined || userIsParticipating === YES

  // Check if there are any participants in the list
  const hasParticipants =
    Array.isArray(participantList) && participantList.length > 0

  // Validation: User must either be participating OR have at least one participant in the list
  const isValid = isUserParticipating || hasParticipants

  // Set validation callback
  useEffect(() => {
    if (!setBeforeSubmitCallback) {
      return
    }

    setBeforeSubmitCallback(async () => {
      if (!isValid) {
        setError(PARTICIPANT_VALIDATION_FIELD_ID, {
          type: 'custom',
        })
        return [false, 'No participants registered']
      }
      clearErrors(PARTICIPANT_VALIDATION_FIELD_ID)
      return [true, null]
    })
  }, [setBeforeSubmitCallback, isValid, setError, clearErrors])

  // Clear errors when validation passes
  useEffect(() => {
    if (isValid) {
      clearErrors(PARTICIPANT_VALIDATION_FIELD_ID)
    }
  }, [isValid, clearErrors])

  // Check if there are validation errors
  const hasErrors = !!errors?.[PARTICIPANT_VALIDATION_FIELD_ID]

  return (
    <Box>
      {hasErrors && (
        <Box marginTop={4}>
          <AlertMessage
            type="error"
            title={formatMessage(m.participant.participantValidationError)}
          />
        </Box>
      )}
    </Box>
  )
}

export default ParticipantValidation
