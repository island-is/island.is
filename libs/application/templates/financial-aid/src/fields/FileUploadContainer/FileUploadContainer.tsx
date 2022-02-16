import React, { ReactNode } from 'react'
import { Text, Box, GridRow, GridColumn } from '@island.is/island-ui/core'
import cn from 'classnames'
import * as styles from './FileUploadContainer.css'

interface Props {
  children: ReactNode
  hasError: boolean
}

const FileUploadContainer = ({ children, hasError = false }: Props) => {
  return (
    <GridRow marginBottom={3}>
      <GridColumn
        span={['12/12', '12/12', '12/12', '9/12']}
        offset={['0', '0', '0', '1/12']}
      >
        <Box marginBottom={[1, 1, 2]}>{children}</Box>
        <div
          className={cn({
            [`${styles.errorMessage}`]: true,
            [`${styles.showErrorMessage}`]: hasError,
          })}
        >
          <Text color="red600" fontWeight="semiBold" variant="small">
            Þú þarft að hlaða upp gögnum
          </Text>
        </div>
      </GridColumn>
    </GridRow>
  )
}

export default FileUploadContainer
