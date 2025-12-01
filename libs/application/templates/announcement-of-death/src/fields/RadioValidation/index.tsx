import React, { FC, useState, useEffect, useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

export const RadioValidation: FC<FieldBaseProps> = ({
  setBeforeSubmitCallback,
  field,
}) => {
  const { formatMessage } = useLocale()
  const { getValues } = useFormContext()
  const [showError, setShowError] = useState(false)

  // Extract field ID from validation field ID (e.g., 'knowledgeOfOtherWills.validation' -> 'knowledgeOfOtherWills')
  const fieldId = field.id.replace('.validation', '')

  const validate = useCallback(async (): Promise<
    [true, null] | [false, string]
  > => {
    setShowError(false)

    const value = getValues(fieldId)

    // Block if field is empty, undefined, or not 'yes'/'no'
    if (!value || (value !== 'yes' && value !== 'no')) {
      setShowError(true)
      return [false, ''] as [false, string]
    }

    return [true, null] as [true, null]
  }, [fieldId, getValues])

  useEffect(() => {
    setBeforeSubmitCallback?.(validate)
  }, [setBeforeSubmitCallback, validate])

  return (
    <Box>
      {showError && (
        <AlertMessage
          title={formatMessage({
            id: 'aod.application:error.requiredSelection',
            defaultMessage: 'Þú verður að velja annaðhvort já eða nei',
            description: 'Error when radio button not selected',
          })}
          message={formatMessage({
            id: 'aod.application:error.requiredSelection.description',
            defaultMessage:
              'Vinsamlegast veldu einn valmöguleika til að halda áfram',
            description: 'Error description when radio button not selected',
          })}
          type="error"
        />
      )}
    </Box>
  )
}
