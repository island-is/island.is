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
      rel="noreferrer noopener"
    >
      <LogoSvg name={municipality?.id} />
    </a>
  )
}

export default Logo
