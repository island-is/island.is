import { Features } from '@island.is/feature-flags'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import { useEffect, useState } from 'react'
import { DashboardV1 } from './DashboardV1/DashboardV1'
import { DashboardV2 } from './DashboardV2/DashboardV2'

export const Dashboard = () => {
  const featureFlagClient = useFeatureFlagClient()
  const [useNewDashboard, setUseNewDashboard] = useState(false)

  useEffect(() => {
    featureFlagClient
      .getValue(Features.servicePortalDashboardV2PageEnabled, false)
      .then((value) => setUseNewDashboard(Boolean(value)))
  }, [featureFlagClient])

  return useNewDashboard ? <DashboardV2 /> : <DashboardV1 />
}

export default Dashboard
