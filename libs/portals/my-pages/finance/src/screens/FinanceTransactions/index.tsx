import { Features, useFeatureFlagClient } from '@island.is/react/feature-flags'
import { Box, SkeletonLoader } from '@island.is/island-ui/core'
import { useEffect, useState } from 'react'
import FinanceTransactionsV2 from './V2/FinanceTransactions'
import FinanceTransactionsV3 from './V3/FinanceTransactions'

const FinanceTransactions = () => {
  const featureFlagClient = useFeatureFlagClient()
  const [enabled, setEnabled] = useState<boolean | null>(null)

  useEffect(() => {
    featureFlagClient
      .getValue(Features.isServicePortalFinanceTransactionsV3Enabled, false)
      .then(setEnabled)
  }, [featureFlagClient])

  console.log('is enabled', enabled)

  if (enabled === null) {
    return (
      <Box padding={3}>
        <SkeletonLoader space={1} height={40} repeat={5} />
      </Box>
    )
  }

  return enabled ? <FinanceTransactionsV3 /> : <FinanceTransactionsV2 />
}

export default FinanceTransactions
