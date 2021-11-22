import { PaymentScheduleEmployer } from '@island.is/api/schema'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import React from 'react'
import { PaymentPlanExternalData } from '../../types'
import { format as formatKennitala } from 'kennitala'

export const EmployerInfo = ({ application }: FieldBaseProps) => {
  const employerInfo = (application.externalData as PaymentPlanExternalData)
    .paymentPlanPrerequisites?.data?.employer as PaymentScheduleEmployer

  if (!employerInfo) {
    // TODO: What should happen?
    return null
  }

  return (
    <Box marginTop={5} marginBottom={3}>
      <Text variant="h2">{employerInfo.name}</Text>
      <Text variant="eyebrow" color="blue400">
        {`kt. ${formatKennitala(employerInfo.nationalId)}`}
      </Text>
    </Box>
  )
}
