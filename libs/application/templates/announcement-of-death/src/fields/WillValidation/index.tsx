import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, InputError } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { willValidation } from '../../lib/constants'
import React from 'react'

export const WillValidation: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  setBeforeSubmitCallback,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const { watch, setError, clearErrors } = useFormContext()

  const knowledgeOfOtherWills = watch('knowledgeOfOtherWills')

  // Check if the radio field has been answered
  const isAnswered =
    knowledgeOfOtherWills === 'yes' || knowledgeOfOtherWills === 'no'

  // Set validation callback
  setBeforeSubmitCallback &&
    setBeforeSubmitCallback(async () => {
      if (!isAnswered) {
        setError(willValidation, {
          type: 'custom',
        })
        return [false, 'will knowledge not answered']
      }
      return [true, null]
    })

  // Clear errors when the field is answered
  useEffect(() => {
    if (isAnswered) {
      clearErrors(willValidation)
    }
  }, [isAnswered, clearErrors])

  return (
    <Box>
      {!!errors?.[willValidation] && (
        <Box marginTop={4}>
          <InputError errorMessage={formatMessage(m.willValidationError)} />
        </Box>
      )}
    </Box>
  )
}

export default WillValidation
