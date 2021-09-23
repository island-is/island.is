import React, { useContext, useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import LogoSvg from './LogoSvg'
import { MunicipalityContext } from '../MunicipalityProvider/MunicipalityProvider'

interface LogoProps {
  className?: string
}

const Logo = ({ className }: LogoProps) => {
  const { municipality } = useContext(MunicipalityContext)

  return (
    <a
      href={
        municipality?.homePage
          ? municipality.homePage
          : 'https://www.samband.is/'
      }
      target="_blank"
      className={cn({ [`${className}`]: true })}
    >
      <LogoSvg name={municipality?.id ? municipality.id : 'sis'} />
    </a>
  )
}

export default Logo
