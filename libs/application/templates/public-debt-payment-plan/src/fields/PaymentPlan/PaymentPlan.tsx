import { FieldBaseProps, getErrorViaPath } from '@island.is/application/core'
import { Box, LoadingIcon, Text } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import React from 'react'
import { PublicDebtPaymentPlan } from '../../lib/dataSchema'
import { useMockPayments } from '../PaymentPlanList/mockPayments'

export const PaymentPlan = ({ application, field, errors }: FieldBaseProps) => {
  const answers = application.answers as PublicDebtPaymentPlan
  const { payments, loading } = useMockPayments()
  const id = answers.paymentPlanContext?.activePayment
  const payment = payments.find((x) => x.id === id)
  const monthsField = `${field.id}.monthsTest`

  if (loading)
    return (
      <Box display="flex" justifyContent="center" paddingY={6}>
        <LoadingIcon size={40} />
      </Box>
    )

  if (!payment)
    return (
      <div>Eitthvað fór úrskeiðis, núverandi greiðsludreifing fannst ekki</div>
    )

  console.log(errors)
  console.log('months field', monthsField)

  return (
    <div>
      <Text variant="h2">{payment.paymentSchedule}</Text>
      <InputController
        id={monthsField}
        name={monthsField}
        label="months"
        error={errors && getErrorViaPath(errors, monthsField)}
        backgroundColor="blue"
        required
      />
    </div>
  )
}
