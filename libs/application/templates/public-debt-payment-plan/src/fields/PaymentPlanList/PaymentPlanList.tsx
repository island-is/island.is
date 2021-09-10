import { PaymentScheduleDebts } from '@island.is/api/schema'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React from 'react'
import { paymentPlan } from '../../lib/messages/paymentPlan'
import { getPaymentPlanIds, getPaymentPlanKeyById } from '../../shared/utils'
import { PaymentPlanExternalData, PublicDebtPaymentPlan } from '../../types'
import { PaymentPlanCard } from './PaymentPlanCard/PaymentPlanCard'

export const PaymentPlanList = ({
  application,
  goToScreen,
}: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const paymentScheduleDebts = (
    application.externalData as PaymentPlanExternalData
  ).paymentPlanPrerequisites?.data?.debts as PaymentScheduleDebts[]
  const answers = application.answers as PublicDebtPaymentPlan

  const handleEditPaymentPlan = (id: string) => {
    const clickedPlanKey = getPaymentPlanKeyById(answers.paymentPlans, id)
    if (clickedPlanKey && goToScreen)
      goToScreen(`paymentPlans.${clickedPlanKey}`)
  }

  return (
    <Box>
      <Text marginBottom={4} marginTop={1}>
        {formatMessage(paymentPlan.general.pageDescription)}
      </Text>
      {paymentScheduleDebts?.map((payment, index) => {
        const isAnswered = getPaymentPlanIds(answers.paymentPlans).some(
          (id) => id === payment.type,
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
