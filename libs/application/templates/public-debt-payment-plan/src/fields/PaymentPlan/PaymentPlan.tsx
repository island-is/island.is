import { FieldBaseProps } from '@island.is/application/core'
import { Text } from '@island.is/island-ui/core'
import React from 'react'
import { PaymentPlanExternalData } from '../../lib/dataSchema'

export const PaymentPlan = ({ application, field, errors }: FieldBaseProps) => {
  const externalData = application.externalData as PaymentPlanExternalData
  const index = field.defaultValue as number
  const payment = externalData.paymentPlanList?.data[index]

  if (!payment)
    return (
      <div>Eitthvað fór úrskeiðis, núverandi greiðsludreifing fannst ekki</div>
    )

  return (
    <div>
      <Text variant="h2">{payment.paymentSchedule}</Text>
    </div>
  )
}
