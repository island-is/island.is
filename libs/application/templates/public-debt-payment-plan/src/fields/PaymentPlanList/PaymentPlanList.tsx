import React from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { paymentPlan } from '../../lib/messages/paymentPlan'
import {
  PaymentPlanExternalData,
  PublicDebtPaymentPlan,
} from '../../lib/dataSchema'
import { PaymentPlanCard } from './PaymentPlanCard/PaymentPlanCard'

export const PaymentPlanList = ({ application }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const paymentPlanList = (application.externalData as PaymentPlanExternalData)
    .paymentPlanList
  const anwers = application.answers as PublicDebtPaymentPlan

  return (
    <Box>
      <Text marginBottom={3}>
        {formatMessage(paymentPlan.general.pageDescription)}
      </Text>
      {paymentPlanList?.data.map((payment, index) => {
        const isAnswered = anwers.paymentPlans.some(
          (plan) => plan.id === payment.id,
        )
        return (
          <PaymentPlanCard
            payment={payment}
            isAnswered={isAnswered}
            key={index}
          />
        )
      })}
    </Box>
  )
}
