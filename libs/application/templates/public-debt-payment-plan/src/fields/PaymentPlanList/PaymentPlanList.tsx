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

export const PaymentPlanList = ({
  application,
  goToScreen,
}: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const paymentPlanList = (application.externalData as PaymentPlanExternalData)
    .paymentPlanList
  const answers = application.answers as PublicDebtPaymentPlan

  const handleEditPaymentPlan = (id: string) => {
    const clickedPlanIndex = answers.paymentPlans?.map((x) => x.id).indexOf(id)
    if (clickedPlanIndex !== undefined && clickedPlanIndex > -1 && goToScreen)
      goToScreen(`paymentPlans[${clickedPlanIndex}]`)
  }

  return (
    <Box>
      <Text marginBottom={3}>
        {formatMessage(paymentPlan.general.pageDescription)}
      </Text>
      {paymentPlanList?.data.map((payment, index) => {
        const isAnswered = answers.paymentPlans?.some(
          (plan) => plan.id === payment.id,
        )
        return (
          <PaymentPlanCard
            payment={payment}
            isAnswered={isAnswered}
            onEditClick={handleEditPaymentPlan}
            key={index}
          />
        )
      })}
    </Box>
  )
}
