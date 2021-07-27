import React from 'react'
import { PaymentDistribution } from '../../lib/dataSchema'
import { useDistributionTable } from '../../lib/paymentPlanUtils'
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
