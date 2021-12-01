import { PaymentScheduleEmployer } from '@island.is/api/schema'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import * as Sentry from '@sentry/react'
import { format as formatKennitala } from 'kennitala'
import React from 'react'
import { PaymentPlanExternalData, PublicDebtPaymentPlan } from '../../types'

export const EmployerInfo = ({ application }: FieldBaseProps) => {
  const employerInfo = (application.externalData as PaymentPlanExternalData)
    .paymentPlanPrerequisites?.data?.employer as PaymentScheduleEmployer

  const correctedNationalId = (application.answers as PublicDebtPaymentPlan)
    ?.employer?.correctedNationalId?.id

  if (!employerInfo) {
    Sentry.captureException(
      'Public Dept Payment Plan Application: Did not receive employer information from service.',
    )
    return null
  }

  return (
    <Box marginTop={5} marginBottom={3}>
      {!correctedNationalId && <Text variant="h2">{employerInfo.name}</Text>}
      <Text variant="eyebrow" color="blue400">
        {`kt. ${formatKennitala(
          correctedNationalId || employerInfo.nationalId,
        )}`}
      </Text>
    </Box>
  )
}
