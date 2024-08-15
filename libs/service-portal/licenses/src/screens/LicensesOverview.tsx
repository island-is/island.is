import { Features } from '@island.is/feature-flags'

import { FeatureFlagClient } from '@island.is/feature-flags'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import { useEffect, useState } from 'react'
import LicensesOverview from './v1/LicensesOverview'
import LicensesOverviewV2 from './v2/LicensesOverview/LicensesOverview'
import { CardLoader } from '@island.is/service-portal/core'

export type VersionType = 'v1' | 'v2' | 'initial'

const Overview = () => {
  const featureFlagClient: FeatureFlagClient = useFeatureFlagClient()
  const [version, setVersion] = useState<VersionType>('initial')
  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        Features.licensesV2,
        false,
      )

      if (ffEnabled) {
        setVersion('v2')
      } else {
        setVersion('v1')
      }
    }
    isFlagEnabled()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  switch (version) {
    case 'v1':
      return <LicensesOverview />
    case 'v2':
      return <LicensesOverviewV2 />
    default:
      return <CardLoader />
  }
}

export default Overview
