import React from 'react'

interface LogoSvgProps {
  category: string
}

const LicenseIcon = ({ category }: LogoSvgProps) => {
  return <img src={`./assets/icons/${category}.svg`} alt="" />
}

export default LicenseIcon
