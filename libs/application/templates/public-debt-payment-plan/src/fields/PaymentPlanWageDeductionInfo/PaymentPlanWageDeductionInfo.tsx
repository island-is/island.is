import { useLocale } from '@island.is/localization'
import React from 'react'
import { Box, Bullet, BulletList } from '@island.is/island-ui/core'
import { paymentPlan } from '../../lib/messages/paymentPlan'

export const PaymentPlanWageDeductionInfo = () => {
  const { formatMessage } = useLocale()
  return (
    <Box marginTop={3}>
      <BulletList space={5}>
        <Bullet>
          {formatMessage(paymentPlan.labels.wageDeductionPointOne)}
        </Bullet>
        <Bullet>
          {formatMessage(paymentPlan.labels.wageDeductionPointTwo)}
        </Bullet>
      </BulletList>
    </Box>
  )
}
