import { Features } from '@island.is/feature-flags'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import { useEffect, useState } from 'react'
import { DashboardV1 } from './DashboardV1/DashboardV1'
import { DashboardV2 } from './DashboardV2/DashboardV2'

// This is temporary until we can remove DashboardV1, then we will rename DashboardV2 to Dashboard
// and delete DashboardV1 as well as the flag and routing code in this file
export const Dashboard = () => {
  const featureFlagClient = useFeatureFlagClient()
  const [useNewDashboard, setUseNewDashboard] = useState<boolean | null>(null)

  useEffect(() => {
    featureFlagClient
      .getValue(Features.isServicePortalDashboardV2PageEnabled, false)
      .then((value) => setUseNewDashboard(Boolean(value)))
  }, [featureFlagClient])

  if (useNewDashboard === null) return null

  return useNewDashboard ? <DashboardV2 /> : <DashboardV1 />
}

export default Dashboard
