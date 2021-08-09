import React from 'react'
import { useDistributionTable } from '../../lib/paymentPlanUtils'
import { PaymentDistribution } from '../../types'
import { PaymentPlanTable } from '../components/PaymentPlanTable/PaymentPlanTable'

export const DistributionTable = ({
  monthAmount,
  monthCount,
  totalAmount,
  scheduleType,
}: PaymentDistribution) => {
  const { isLoading, distributionData } = useDistributionTable({
    monthAmount,
    monthCount,
    totalAmount,
    scheduleType,
  })
  if (!distributionData) return null
  return (
    <PaymentPlanTable
      isLoading={isLoading}
      data={distributionData}
      totalAmount={totalAmount}
    />
  )
}
