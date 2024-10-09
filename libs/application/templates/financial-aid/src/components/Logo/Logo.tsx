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
      const svgLogo = await import(
        `../../assets/svg/${
          logoKeyFromMunicipalityCode[
            municipality ? municipality?.municipalityId : ''
          ]
        }`
      )
      setLogo(svgLogo.default)
    }
    getLogo()
  }, [])

  return <img src={logo} alt="Municipality logo" />
}
