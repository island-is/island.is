import React, { ReactNode } from 'react'
import { Text, Box } from '@island.is/island-ui/core'

import * as styles from './FileUploadContainer.css'
import cn from 'classnames'

interface Props {
  children: ReactNode
  hasError: boolean
}

const FileUploadContainer = ({ children, hasError = false }: Props) => {
  return (
    <div className={styles.fileContainer}>
      <Box className={styles.files} marginBottom={[1, 1, 2]}>
        {children}
      </Box>
      <div
        className={cn({
          [`errorMessage ${styles.files}`]: true,
          [`showErrorMessage`]: hasError,
        })}
      >
        <Text color="red600" fontWeight="semiBold" variant="small">
          Þú þarft að hlaða upp gögnum
        </Text>
      </div>
    </div>
  )
}

export default FileUploadContainer
