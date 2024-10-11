import { Features } from '@island.is/feature-flags'

import { FeatureFlagClient } from '@island.is/feature-flags'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import { useEffect, useState } from 'react'
import OverviewV1 from '../v1/OccupationalLicensesOverview/OccupationalLicensesOverviewV1'
import OverviewV2 from '../v2/OccupationalLicensesOverview/OccupationalLicensesOverview'
import { CardLoader } from '@island.is/service-portal/core'

export type VersionType = 'v1' | 'v2' | 'initial'

const OccupationalLicensesOverview = () => {
  const featureFlagClient: FeatureFlagClient = useFeatureFlagClient()
  const [version, setVersion] = useState<VersionType>('initial')
  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        Features.occupationalLicensesV2,
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
      return <OverviewV1 />
    case 'v2':
      return <OverviewV2 />
    default:
      return <CardLoader />
  }
}

export default OccupationalLicensesOverview
