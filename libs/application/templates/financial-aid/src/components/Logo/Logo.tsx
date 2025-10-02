import { Application } from '@island.is/application/types'
import { Municipality } from '@island.is/financial-aid/shared/lib'
import { getMunicipalityLogo } from '@island.is/application/assets/institution-logos'
import React from 'react'

type Props = {
  application: Application
  className?: string
  width?: number | string
  height?: number | string
}

export const Logo = ({ application, className, width, height }: Props) => {
  const municipality = application.externalData.municipality
    ?.data as Municipality

  const municipalityId = municipality?.municipalityId || ''
  const LogoComponent = getMunicipalityLogo(municipalityId)

  return <LogoComponent className={className} width={width} height={height} />
}
