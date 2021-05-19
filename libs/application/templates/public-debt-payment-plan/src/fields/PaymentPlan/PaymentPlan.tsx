import { FieldBaseProps, getErrorViaPath } from '@island.is/application/core'
import { Box, RadioButton, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  PaymentPlanExternalData,
  PublicDebtPaymentPlan,
} from '../../lib/dataSchema'
import { paymentPlan } from '../../lib/messages/paymentPlan'
import { PaymentPlanCard } from '../PaymentPlanList/PaymentPlanCard/PaymentPlanCard'

type PaymentModeState = null | 'amount' | 'months'

export const PaymentPlan = ({ application, field }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const [paymentMode, setPaymentMode] = useState<PaymentModeState>(null)
  const { register, errors } = useFormContext()
  const externalData = application.externalData as PaymentPlanExternalData
  const answers = application.answers as PublicDebtPaymentPlan
  const index = field.defaultValue as number
  const payment = externalData.paymentPlanList?.data[index]
  // Locate the index of the payment plan in answers. If none is found, use the default index
  const answerIndex =
    answers.paymentPlans?.findIndex(
      (plan) => payment?.id && plan.id === payment.id,
    ) || index
  const entry = `paymentPlans[${answerIndex}]`

  const handleSelectPaymentMode = (mode: PaymentModeState) => {
    setPaymentMode(mode)
  }

  if (!payment)
    // TODO: Better error message
    return (
      <div>Eitthvað fór úrskeiðis, núverandi greiðsludreifing fannst ekki</div>
    )

  return (
    <div>
      <input
        type="hidden"
        value={payment.id}
        ref={register({ required: true })}
        name={`${entry}.id`}
      />
      <Text marginBottom={5}>
        {formatMessage(paymentPlan.general.paymentPlanDescription)}
      </Text>
      <Box marginBottom={[5, 5, 8]}>
        <PaymentPlanCard payment={payment} />
      </Box>
      <Text variant="h4" marginBottom={3}>
        {formatMessage(paymentPlan.labels.paymentModeTitle)}
      </Text>
      <Stack space={2}>
        <RadioButton
          label={formatMessage(paymentPlan.labels.payByAmount)}
          backgroundColor="blue"
          large
          id="payment-mode-amount"
          name="paymentMode"
          value="amount"
          checked={paymentMode === 'amount'}
          onChange={handleSelectPaymentMode.bind(null, 'amount')}
        />
        <RadioButton
          label={formatMessage(paymentPlan.labels.payByMonths)}
          backgroundColor="blue"
          large
          id="payment-mode-months"
          name="paymentMode"
          value="months"
          checked={paymentMode === 'months'}
          onChange={handleSelectPaymentMode.bind(null, 'months')}
        />
      </Stack>
    </div>
  )
}
