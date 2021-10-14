import React, { useContext, useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import LogoSvg from './LogoSvg'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'

interface LogoProps {
  className?: string
}

const Logo = ({ className }: LogoProps) => {
  const { municipality } = useContext(AppContext)

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
