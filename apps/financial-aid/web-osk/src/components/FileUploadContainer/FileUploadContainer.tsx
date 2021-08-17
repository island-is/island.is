import React, { ReactNode, useContext } from 'react'
import { Text, GridContainer, Box } from '@island.is/island-ui/core'

import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'
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
