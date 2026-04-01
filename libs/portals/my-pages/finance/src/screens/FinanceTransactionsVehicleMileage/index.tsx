import { Features, useFeatureFlagClient } from '@island.is/react/feature-flags'
import { Box, SkeletonLoader } from '@island.is/island-ui/core'
import { useEffect, useState } from 'react'
import FinanceVehicleMileageV2 from './V2/FinanceTransactionsVehicleMileage'
import FinanceVehicleMileageV3 from './V3/FinanceTransactionsVehicleMileage'

const FinanceVehicleMileage = () => {
  const featureFlagClient = useFeatureFlagClient()
  const [enabled, setEnabled] = useState<boolean | null>(null)

  useEffect(() => {
    featureFlagClient
      .getValue(Features.isServicePortalFinanceTransactionsV3Enabled, false)
      .then(setEnabled)
      .catch(() => setEnabled(false))
  }, [featureFlagClient])

  if (enabled === null) {
    return (
      <Box padding={3}>
        <SkeletonLoader space={1} height={40} repeat={5} />
      </Box>
    )
  }

  return enabled ? <FinanceVehicleMileageV3 /> : <FinanceVehicleMileageV2 />
}

export default FinanceVehicleMileage
