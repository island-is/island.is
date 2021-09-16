import React from 'react'
import cn from 'classnames'

import LogoSvg from './LogoSvg'

interface LogoProps {
  className?: string
}

const LogoHfj = ({ className }: LogoProps) => {
  return (
    <a
      href="https://www.hafnarfjordur.is/"
      target="_blank"
      rel="noopener noreferrer"
      className={cn({ [`${className}`]: true })}
    >
      <LogoSvg name="hfj.svg" />
    </a>
  )
}

export default LogoHfj
