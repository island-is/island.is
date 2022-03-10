import React from 'react'

interface LogoSvgProps {
  category: string
}

const LicenseIcon = ({ category }: LogoSvgProps) => {
  return (
    <img
      src={`./assets/icons/${category}.svg`}
      alt={`driving-license-icon-${category}`}
    />
  )
}

export default LicenseIcon
