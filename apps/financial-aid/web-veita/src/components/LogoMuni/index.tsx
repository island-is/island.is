import React from 'react'
import cn from 'classnames'

import LogoSvg from './LogoSvg'
import { useRouter } from 'next/router'

interface LogoProps {
  className?: string
}

const LogoHfj = ({ className }: LogoProps) => {
  const router = useRouter()

  return (
    <a
      href="https://www.hafnarfjordur.is/"
      target="_blank"
      rel="noopener noreferrer"
      className={cn({ [`${className}`]: true })}
    >
      <LogoSvg name={router.query.sveitarfelag as string} />
    </a>
  )
}

export default LogoHfj
