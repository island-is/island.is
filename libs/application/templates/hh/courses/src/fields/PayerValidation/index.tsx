import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, AlertMessage } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { YES } from '@island.is/application/core'
import * as kennitala from 'kennitala'
import React from 'react'

const PAYER_VALIDATION_FIELD_ID = 'payerValidation'

export const PayerValidation: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  setBeforeSubmitCallback,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const { watch, setError, clearErrors } = useFormContext()

  const userIsPayingAsIndividual = watch('userIsPayingAsIndividual')
  const companyPayment = watch('companyPayment')

  // Validation: If user is paying as individual (YES), companyPayment can be empty
  // If user is paying as company (NO), companyPayment.nationalId and companyPayment.name are required and must be valid
  const isValid =
    userIsPayingAsIndividual === YES ||
    (companyPayment?.nationalId &&
      companyPayment?.name &&
      companyPayment.nationalId.length > 0 &&
      companyPayment.name.length > 0 &&
      kennitala.isValid(companyPayment.nationalId))

  // Set validation callback
  useEffect(() => {
    if (!setBeforeSubmitCallback) {
      return
    }

    setBeforeSubmitCallback(async () => {
      if (!isValid) {
        setError(PAYER_VALIDATION_FIELD_ID, {
          type: 'custom',
        })
        return [false, 'Company payment information is required']
      }
      clearErrors(PAYER_VALIDATION_FIELD_ID)
      return [true, null]
    })
  }, [setBeforeSubmitCallback, isValid, setError, clearErrors])

  // Clear errors when validation passes
  useEffect(() => {
    if (isValid) {
      clearErrors(PAYER_VALIDATION_FIELD_ID)
    }
  }, [isValid, clearErrors])

  // Check if there are validation errors
  const hasErrors = !!errors?.[PAYER_VALIDATION_FIELD_ID]

  return (
    <Box>
      {hasErrors && (
        <Box marginTop={4}>
          <AlertMessage
            type="error"
            title={formatMessage(m.payer.payerValidationError)}
          />
        </Box>
      )}
    </Box>
  )
}

export default PayerValidation
