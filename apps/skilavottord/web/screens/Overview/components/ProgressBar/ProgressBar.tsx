import React, { FC } from 'react'
import { Box } from '@island.is/island-ui/core'
import * as styles from './ProgressBar.treat'

interface Props {
  progress: number
}

const ProgressBar: FC<Props> = ({ progress }) => {
  const wrapperColor = progress === 100 ? { opacity: '0.3' } : { opacity: '1' }
  return (
    <Box
      background={progress === 100 ? 'dark200' : 'mint200'}
      borderRadius="large"
      style={wrapperColor}
      className={styles.wrapper}
    >
      <Box
        background={progress === 100 ? 'dark300' : 'mint400'}
        borderRadius="large"
        style={{ width: `${progress}%` }}
        className={styles.bar}
      />
    </Box>
  )
}

export default ProgressBar
