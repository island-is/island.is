import React from 'react'
import cn from 'classnames'
import { Box } from '@island.is/island-ui/core'
import { VariationProps } from '../../../types'
import Illustration from './Illustration'

import * as styles from './StafraentIsland.css'

export const StafraentIsland = ({ small }: VariationProps) => {
  return (
    <Box background="blueberry100" className={styles.bg}>
      <div className={cn(styles.illustration, { [styles.small]: small })}>
        <Illustration width="100%" height="100%" />
      </div>
    </Box>
  )
}

export default StafraentIsland
