import React, { useEffect, useState } from 'react'
import cn from 'classnames'

interface LogoSvgProps {
  name: string
  className?: string
}

const LogoSvg = ({ name, className }: LogoSvgProps) => {
  return (
    <div
      className={cn({
        [`${className}`]: className,
      })}
    >
      <img src={`../../../svg/${name}.svg`} alt="" />
    </div>
  )
}

export default LogoSvg
