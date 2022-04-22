import React from 'react'
import {
  ApplicationOverviewSkeleton,
  LoadingContainer,
  MunicipalityAdminSettings,
} from '@island.is/financial-aid-web/veita/src/components'

import { useMunicipalities } from '@island.is/financial-aid-web/veita/src/utils/useMunicipalities'

export const MunicipalitySettings = () => {
  const { municipality, error, loading } = useMunicipalities()

  return (
    <LoadingContainer
      isLoading={loading}
      loader={<ApplicationOverviewSkeleton />}
    >
      {municipality.length > 0 && (
        <MunicipalityAdminSettings currentMunicipality={municipality[0]} />
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
