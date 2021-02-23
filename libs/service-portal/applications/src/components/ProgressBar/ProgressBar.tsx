import React, { FC } from 'react'
import { Box } from '@island.is/island-ui/core'
import * as styles from './ProgressBar.treat'

interface Props {
  progress: number
}

const ProgressBar: FC<Props> = ({ progress }) => {
  return (
    <Box background="blue100" borderRadius="large" className={styles.wrapper}>
      <Box
        background="blue400"
        borderRadius="large"
        style={{ width: `${progress}%` }}
        className={styles.bar}
      />
    </Box>
  )
}

export default ProgressBar
