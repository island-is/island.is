import React from 'react'
import cn from 'classnames'

import { VariationProps } from '../../../types'
import Illustration from './Illustration'
import * as styles from './StafraentIsland.css'

export const StafraentIsland = ({ small }: VariationProps) => {
  return (
    <div className={styles.bg}>
      <div className={cn(styles.illustration, { [styles.small]: small })}>
        <Illustration width="100%" height="100%" />
      </div>
    </div>
  )
}

export default StafraentIsland
