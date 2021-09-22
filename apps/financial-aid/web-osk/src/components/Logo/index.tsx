import React, { useContext } from 'react'
import cn from 'classnames'

import LogoSvg from './LogoSvg'

import { MunicipalityContext } from '@island.is/financial-aid-web/osk/src/components/MunicipalityProvider/MunicipalityProvider'

interface LogoProps {
  className?: string
}

const Logo = ({ className }: LogoProps) => {
  const { municipality } = useContext(MunicipalityContext)

  return (
    <a
      href={municipality ? municipality.homePage : 'https://www.samband.is/'}
      target="_blank"
      className={cn({ [`${className}`]: true })}
    >
      <LogoSvg name={municipality ? municipality.id : 'sis'} />
    </a>
  )
}

export default Logo
