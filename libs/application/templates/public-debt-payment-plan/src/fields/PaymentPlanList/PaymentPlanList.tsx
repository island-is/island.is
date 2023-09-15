import { PaymentScheduleDebts } from '@island.is/api/schema'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React from 'react'
import { paymentPlan } from '../../lib/messages/paymentPlan'
import { isApplicantCompany } from '../../lib/paymentPlanUtils'
import { getPaymentPlanIds, getPaymentPlanKeyById } from '../../shared/utils'
import { PaymentPlans } from '../../types'
import { PaymentPlanCard } from './PaymentPlanCard/PaymentPlanCard'

export const PaymentPlanList = ({
  application,
  goToScreen,
}: FieldBaseProps) => {
  const { formatMessage } = useLocale()

  const paymentScheduleDebts = getValueViaPath(
    application.externalData,
    'paymentPlanPrerequisites.data.debts',
  ) as PaymentScheduleDebts[]

  const paymentPlans = getValueViaPath(
    application.answers,
    'paymentPlans',
  ) as PaymentPlans

  const handleEditPaymentPlan = (id: string) => {
    const clickedPlanKey = getPaymentPlanKeyById(paymentPlans, id)
    if (clickedPlanKey && goToScreen)
      goToScreen(`paymentPlans.${clickedPlanKey}`)
  }

  return (
    <Box>
      <Text marginBottom={4} marginTop={1}>
        {isApplicantCompany(application)
          ? formatMessage(paymentPlan.general.companyPageDescription)
          : formatMessage(paymentPlan.general.pageDescription)}
      </Text>
      {paymentScheduleDebts?.map((payment, index) => {
        const isAnswered = getPaymentPlanIds(paymentPlans).some(
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
