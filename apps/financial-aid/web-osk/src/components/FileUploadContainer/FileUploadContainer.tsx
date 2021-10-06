import React, { ReactNode } from 'react'
import { Text, Box } from '@island.is/island-ui/core'

import * as styles from './FileUploadContainer.treat'
import cn from 'classnames'

interface Props {
  children: ReactNode
}

const FileUploadContainer = ({ children }: Props) => {
  return (
    <div className={styles.fileContainer}>
      <Box className={styles.files} marginBottom={[1, 1, 2]}>
        {children}
      </Box>
      <div
        className={cn({
          [`errorMessage ${styles.files}`]: true,
          [`showErrorMessage`]: false,
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
