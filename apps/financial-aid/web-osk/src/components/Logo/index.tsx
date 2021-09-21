import React from 'react'
import cn from 'classnames'

import LogoSvg from './LogoSvg'
import LogoSIS from './LogoSIS'

interface LogoProps {
  className?: string
  customLogo?: boolean
}

const Logo = ({ className, customLogo }: LogoProps) => {
  return (
    <>
      {customLogo ? (
        <a
          href="https://www.hafnarfjordur.is/"
          target="_blank"
          className={cn({ [`${className}`]: true })}
        >
          <LogoSvg />
        </a>
      ) : (
        <a
          href="https://www.samband.is/"
          target="_blank"
          className={cn({ [`${className}`]: true })}
        >
          <LogoSIS />
        </a>
      )}
    </>
  )
}

export default Logo
