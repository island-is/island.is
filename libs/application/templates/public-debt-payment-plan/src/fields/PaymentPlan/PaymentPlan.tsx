import { FieldBaseProps } from '@island.is/application/core'
import { useAuth } from '@island.is/auth/react'
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
import {
  getEmptyPaymentPlanEntryKey,
  getPaymentPlanKeyById,
} from '../../shared/utils'
import { PlanSlider } from '../components/PlanSlider/PlanSlider'
import { PaymentPlanCard } from '../PaymentPlanList/PaymentPlanCard/PaymentPlanCard'
import * as styles from './PaymentPlan.treat'
import { useDebouncedSliderValues } from './useDebouncedSliderValues'

type PaymentModeState = null | 'amount' | 'months'

// An array might not work for this schema
// Might need to define specific fields for each one
export const PaymentPlan = ({ application, field }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const [paymentMode, setPaymentMode] = useState<PaymentModeState>(null)
  const { register } = useFormContext()
  const { userInfo } = useAuth()
  const externalData = application.externalData as PaymentPlanExternalData
  const answers = application.answers as PublicDebtPaymentPlan
  const index = field.defaultValue as number
  // Assign a payment to this screen by using the index of the step
  const payment = externalData.paymentPlanPrerequisites?.data?.debts[index]
  // Geta min/max month and min/max payment data
  const initialMinMaxData = externalData.paymentPlanPrerequisites?.data?.allInitialSchedules.find(
    (x) => x.scheduleType === payment?.type,
  )
  console.log(initialMinMaxData)
  // Locate the entry of the payment plan in answers.
  const entryKey = getPaymentPlanKeyById(
    answers.paymentPlans,
    payment?.type || '',
  )
  // If no entry is found, find an empty entry to assign to this payment
  const answerKey = (entryKey ||
    getEmptyPaymentPlanEntryKey(
      answers.paymentPlans,
    )) as keyof typeof answers.paymentPlans

  console.log('Answer key: ', answerKey)
  console.log('Answers: ', answers)

  if (!answerKey) {
    // There is no entry available for this plan
    // The user can not continue the application
    // TODO: Better UX and error logging for this
    return <div>No more available entries in schema</div>
  }
  const entry = `paymentPlans.${answerKey}`
  const currentAnswers = answers.paymentPlans
    ? answers.paymentPlans[answerKey]
    : undefined

  const {
    debouncedAmount,
    debouncedMonths,
    setAmount,
    setMonths,
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useDebouncedSliderValues(currentAnswers)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  /* const { isLoading, data: paymentPlanResults } = useMockPaymentPlan(
    userInfo?.profile.nationalId,
    payment?.type,
    debouncedAmount,
    debouncedMonths,
  ) */

  const handleSelectPaymentMode = (mode: PaymentModeState) => {
    setPaymentMode(mode)
  }

  const handleAmountChange = (value: number) => {
    setMonths(undefined)
    setAmount(value)
  }
  const handleMonthChange = (value: number) => {
    setMonths(value)
    setAmount(undefined)
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
        value={payment.type}
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
          minValue={initialMinMaxData?.minPayment || 5000}
          maxValue={initialMinMaxData?.maxPayment || 10000}
          currentValue={initialMinMaxData?.minPayment || 5000}
          multiplier={10000}
          heading={paymentPlan.labels.chooseAmountPerMonth}
          onChange={handleAmountChange}
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
          minValue={initialMinMaxData?.minCountMonth || 1}
          maxValue={initialMinMaxData?.maxCountMonth || 12}
          currentValue={initialMinMaxData?.maxCountMonth || 12}
          heading={paymentPlan.labels.chooseNumberOfMonths}
          onChange={handleMonthChange}
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
      {/* (isLoading || paymentPlanResults) && (
        <Box marginTop={5}>
          <AccordionItem
            id="payment-plan-table"
            label="Greiðsluáætlun skuldar"
            visibleContent={
              <Text>Hér er hægt að sjá heildargreiðsluáætlun skuldar</Text>
            }
            startExpanded
          >
            <PaymentPlanTable isLoading={isLoading} data={paymentPlanResults} />
          </AccordionItem>
        </Box>
          ) */}
    </div>
  )
}
