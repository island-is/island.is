import React, { useContext } from 'react'
import cn from 'classnames'
import LogoSvg from './LogoSvg'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'
import { logoKeyFromMunicipalityCode } from '@island.is/financial-aid/shared/lib'

interface LogoProps {
  className?: string
}

const Logo = ({ className }: LogoProps) => {
  const { municipality } = useContext(AppContext)

  return (
    <a
      href={
        municipality?.homepage
          ? municipality.homepage
          : 'https://www.samband.is/'
      }
      target="_blank"
      className={cn({ [`${className}`]: true })}
      rel="noreferrer noopener"
    >
      <LogoSvg
        name={logoKeyFromMunicipalityCode[municipality?.municipalityId ?? '']}
      />
    </a>
  )
}

export default Logo
