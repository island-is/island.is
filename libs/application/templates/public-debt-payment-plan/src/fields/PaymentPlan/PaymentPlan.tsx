import { FieldBaseProps } from '@island.is/application/core'
import { Box, RadioButton, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  PaymentPlanExternalData,
  PublicDebtPaymentPlan,
} from '../../lib/dataSchema'
import { shared } from '../../lib/messages'
import { paymentPlan } from '../../lib/messages/paymentPlan'
import { PlanSlider } from '../components/PlanSlider/PlanSlider'
import { PaymentPlanCard } from '../PaymentPlanList/PaymentPlanCard/PaymentPlanCard'
import * as styles from './PaymentPlan.treat'

type PaymentModeState = null | 'amount' | 'months'

// An array might not work for this schema
// Might need to define specific fields for each one
export const PaymentPlan = ({ application, field }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const [paymentMode, setPaymentMode] = useState<PaymentModeState>(null)
  const { register, errors } = useFormContext()
  const externalData = application.externalData as PaymentPlanExternalData
  const answers = application.answers as PublicDebtPaymentPlan
  const index = field.defaultValue as number
  const payment = externalData.paymentPlanList?.data[index]
  // Locate the index of the payment plan in answers. If none is found, use the default index
  const answerIndex = answers.paymentPlans?.findIndex(
    (plan) => payment?.id && plan.id === payment.id,
  )
  const entryIndex = answerIndex > -1 ? answerIndex : index
  const entry = `paymentPlans[${entryIndex}]`

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
      {paymentMode === 'amount' && (
        <PlanSlider
          id={`${entry}.amountPerMonth`}
          minValue={30000}
          maxValue={200000}
          currentValue={30000}
          multiplier={10000}
          heading={paymentPlan.labels.chooseAmountPerMonth}
          label={{
            singular: 'kr.',
            plural: 'kr.',
          }}
          descriptor={
            <Box display="flex" justifyContent="flexEnd">
              <Text variant="small" fontWeight="semiBold">
                <span>Greiðsla </span>
                <span className={styles.valueLabel}>60.000 kr. </span>
                <span>í 6 mánuði og </span>
                <span className={styles.valueLabel}>45.585 kr. </span>
                <span>á 7. mánuði.</span>
              </Text>
            </Box>
          }
        />
      )}
      {paymentMode === 'months' && (
        <PlanSlider
          id={`${entry}.numberOfMonths`}
          minValue={1}
          maxValue={12}
          currentValue={12}
          heading={paymentPlan.labels.chooseNumberOfMonths}
          label={{
            singular: formatMessage(shared.month),
            plural: formatMessage(shared.months),
          }}
          descriptor={
            <Box display="flex" justifyContent="flexEnd">
              <Text variant="small" fontWeight="semiBold">
                <span>Greiðsla </span>
                <span className={styles.valueLabel}>60.000 kr. </span>
                <span>í 6 mánuði. Heildargreiðsla með vöxtum er </span>
                <span className={styles.valueLabel}>45.585 kr.</span>
              </Text>
            </Box>
          }
        />
      )}
    </div>
  )
}
