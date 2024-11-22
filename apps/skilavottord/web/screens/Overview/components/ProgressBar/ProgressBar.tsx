import React, { FC } from 'react'
import { Box } from '@island.is/island-ui/core'
import * as styles from './ProgressBar.css'

interface Props {
  progress: number
}

const ProgressBar: FC<React.PropsWithChildren<Props>> = ({ progress }) => {
  return (
    <Box
      background={progress === 100 ? 'mint100' : 'roseTinted100'}
      borderRadius="default"
      className={styles.wrapper}
    >
      <Box
        background={progress === 100 ? 'mint400' : 'roseTinted400'}
        borderRadius="default"
        style={{ width: `${progress}%` }}
        className={styles.bar}
      />
    </Box>
  )
}

export default ProgressBar
