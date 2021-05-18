import React from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import {
  Box,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { paymentPlan } from '../../lib/messages/paymentPlan'
import { PaymentPlanExternalData } from '../../lib/dataSchema'

export const PaymentPlanList = ({ application }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const paymentPlanList = (application.externalData as PaymentPlanExternalData).paymentPlanList

  return (
    <Box>
      <Text marginBottom={3}>
        {formatMessage(paymentPlan.general.pageDescription)}
      </Text>
      {paymentPlanList?.data.map((payment, index) => (
        <Box
          paddingY={3}
          paddingX={4}
          border="standard"
          borderRadius="large"
          marginBottom={3}
          key={index}
        >
          <Box display="flex" justifyContent="spaceBetween">
            <Text variant="eyebrow" color="purple400">
              {payment.organization}
            </Text>
            <Tag variant="purple">Þessi skuld verður send sem krafa</Tag>
          </Box>
          <Text variant="h3" marginBottom={3}>
            {payment.paymentSchedule}
          </Text>
        </Box>
      ))}
    </Box>
  )
}
