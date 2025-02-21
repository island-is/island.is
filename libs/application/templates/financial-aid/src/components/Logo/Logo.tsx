import { Application } from '@island.is/application/types'
import {
  Municipality,
  logoKeyFromMunicipalityCode,
} from '@island.is/financial-aid/shared/lib'
import React, { useEffect, useState } from 'react'
type Props = {
  application: Application
}
export const Logo = ({ application }: Props) => {
  const [logo, setLogo] = useState<string>()
  const municipality = application.externalData.municipality
    ?.data as Municipality

  useEffect(() => {
    const getLogo = async () => {
      const municipalityId =
        municipality && municipality?.municipalityId
          ? municipality.municipalityId
          : ''
      const svgLogo = await import(
        `../../assets/svg/${logoKeyFromMunicipalityCode[municipalityId]}`
      )
      setLogo(svgLogo.default)
    }
    getLogo()
  }, [municipality])
  return <img src={logo} alt="Municipality logo" />
}
