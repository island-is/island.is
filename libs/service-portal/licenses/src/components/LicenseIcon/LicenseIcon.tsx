import React from 'react'
import cn from 'classnames'

import * as styles from './LicenseIcon.css'

interface LogoSvgProps {
  category: string
}

const LicenseIcon = ({ category }: LogoSvgProps) => {
  return (
    <img src={`./assets/icons/${category}.svg`} alt="driving-license-icon" />
  )
}

export default LicenseIcon
