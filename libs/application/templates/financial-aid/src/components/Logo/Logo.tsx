import { Application } from '@island.is/application/types'
import { Municipality } from '@island.is/financial-aid/shared/lib'
import { getMunicipalityLogo } from '@island.is/application/assets/institution-logos'
import React from 'react'

type Props = {
  application: Application
}

export const Logo = ({ application }: Props) => {
  const municipality = application.externalData.municipality
    ?.data as Municipality

  const municipalityId = municipality?.municipalityId || ''
  const LogoComponent = getMunicipalityLogo(municipalityId)

  return <LogoComponent />
}
