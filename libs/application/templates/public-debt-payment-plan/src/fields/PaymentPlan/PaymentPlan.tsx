import { FieldBaseProps, getErrorViaPath } from '@island.is/application/core'
import { Text } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import {
  PaymentPlanExternalData,
  PublicDebtPaymentPlan,
} from '../../lib/dataSchema'

export const PaymentPlan = ({ application, field }: FieldBaseProps) => {
  const { register, clearErrors, errors, trigger, getValues } = useFormContext()
  const externalData = application.externalData as PaymentPlanExternalData
  const answers = application.answers as PublicDebtPaymentPlan
  const index = field.defaultValue as number
  const payment = externalData.paymentPlanList?.data[index]
  // Locale the index of the payment plan in answers. If none is found, use the default index
  const answerIndex =
    answers.paymentPlans?.findIndex(
      (plan) => payment?.id && plan.id === payment.id,
    ) || index
  const entry = `paymentPlans[${answerIndex}]`

  if (!payment)
    return (
      <div>Eitthvað fór úrskeiðis, núverandi greiðsludreifing fannst ekki</div>
    )

  return (
    <div>
      <Text variant="h2">{payment.paymentSchedule}</Text>
      <input
        type="hidden"
        value={payment.id}
        ref={register({ required: true })}
        name={`${entry}.id`}
      />
      <InputController
        id={`${entry}.monthsTest`}
        name={`${entry}.monthsTest`}
        label={'Months test'}
        error={errors && getErrorViaPath(errors, `${entry}.monthsTest`)}
        backgroundColor="blue"
      />
    </div>
  )
}
