import React from 'react'
import {
  ApplicationOverviewSkeleton,
  LoadingContainer,
  MunicipalityAdminSettings,
} from '@island.is/financial-aid-web/veita/src/components'

import { useMunicipality } from '@island.is/financial-aid/shared/components'

export const MunicipalitySettings = () => {
  const { municipality, error, loading } = useMunicipality()

  return (
    <LoadingContainer
      isLoading={loading}
      loader={<ApplicationOverviewSkeleton />}
    >
      {municipality && (
        <MunicipalityAdminSettings municipality={municipality} />
      )}

      {error && (
        <div>
          Abbabab mistókst að sækja sveitarfélagsstillingar, ertu örugglega með
          aðgang að þessu upplýsingum?
        </div>
      )}
    </LoadingContainer>
  )
}

export default MunicipalitySettings
