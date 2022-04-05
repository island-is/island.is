import React, { useEffect, useState } from 'react'
import {
  ApplicationOverviewSkeleton,
  LoadingContainer,
  MunicipalityAdminSettings,
  SelectedMunicipality,
} from '@island.is/financial-aid-web/veita/src/components'

import { Municipality } from '@island.is/financial-aid/shared/lib'
import { useMunicipalities } from '@island.is/financial-aid-web/veita/src/utils/useMunicipalities'

export const MunicipalitySettings = () => {
  const { municipality, error, loading } = useMunicipalities()

  const [currentMunicipality, setCurrentMunicipality] = useState<Municipality>()

  useEffect(() => {
    if (municipality && municipality.length > 0) {
      setCurrentMunicipality(municipality[0])
    }
  }, [municipality])

  return (
    <LoadingContainer
      isLoading={loading}
      loader={<ApplicationOverviewSkeleton />}
    >
      {municipality && currentMunicipality && (
        <SelectedMunicipality
          municipality={municipality}
          currentMunicipality={currentMunicipality}
          setCurrentMunicipality={setCurrentMunicipality}
        />
      )}
      {currentMunicipality && (
        <MunicipalityAdminSettings currentMunicipality={currentMunicipality} />
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
