import React from 'react'
import cn from 'classnames'

import * as styles from './LicenseIcon.css'

interface LogoSvgProps {
  category: string
}

const LicenseIcon = ({ category }: LogoSvgProps) => {
  return (
    <div
      className={cn({
        [`${styles.logo}`]: true,
      })}
    >
      <img src={`../../../../driving-license-icons/${category}`} alt="" />
    </div>
  )
}

export default LicenseIcon
