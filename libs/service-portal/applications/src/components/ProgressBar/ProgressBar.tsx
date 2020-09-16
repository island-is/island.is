import React, { FC } from 'react'
import { Box } from '@island.is/island-ui/core'
import * as styles from './ProgressBar.treat'

interface Props {
  progress: number
}

const ProgressBar: FC<Props> = ({ progress }) => {
  return (
    <Box background="mint200" borderRadius="large" className={styles.wrapper}>
      <Box
        background="mint400"
        borderRadius="large"
        style={{ width: `${progress}%` }}
        className={styles.bar}
      />
    </Box>
  )
}

export default ProgressBar
