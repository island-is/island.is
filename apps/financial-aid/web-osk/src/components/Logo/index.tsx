import React, { useContext, useEffect, useMemo, useState } from 'react'
import cn from 'classnames'

import LogoSvg from './LogoSvg'

import { MunicipalityContext } from '@island.is/financial-aid-web/osk/src/components/MunicipalityProvider/MunicipalityProvider'
import { Municipality } from '@island.is/financial-aid/shared/lib'

interface LogoProps {
  className?: string
}

const Logo = ({ className }: LogoProps) => {
  const { municipality } = useContext(MunicipalityContext)

  return (
    <a
      href={'https://www.samband.is/'}
      target="_blank"
      className={cn({ [`${className}`]: true })}
    >
      <LogoSvg name={'hfj'} />
    </a>
  )
}

export default Logo
